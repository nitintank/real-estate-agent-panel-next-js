import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/AddProperty.module.css";
import Image from 'next/image';

const AddProperty = () => {
    const [propertyName, setPropertyName] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [bedroom, setBedroom] = useState('');
    const [bathroom, setBathroom] = useState('');
    const [size, setSize] = useState('');
    const [area, setArea] = useState('');
    const [parking, setParking] = useState('');
    const [buildArea, setBuildArea] = useState('');
    const [plotUpArea, setPlotUpArea] = useState('');
    const [furnishing_type, setFurnishing_type] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [title_deed, setTitle_deed] = useState('');
    const [imagePaths, setImagePaths] = useState([]);
    const [videoPaths, setVideoPaths] = useState([]);
    const [mediaPaths, setMediaPaths] = useState([]);
    const [propertydocumnetpaths, setPropertyDocumentPaths] = useState([]);
    const [token, setToken] = useState(null);
    const [propertySubtype, setPropertySubtype] = useState('');
    const [saleOrRent, setSaleOrRent] = useState('');
    const [amenities, setAmenities] = useState({
        recreationAndFamily: [],
        healthAndFitness: [],
        features: [],
        cleaningAndMaintenance: [],
    });

    const autocompleteRef = useRef(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handlePropertyTypeChange = (e) => {
        setPropertyType(e.target.value);
        setPropertySubtype('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('property_name', propertyName);
        formData.append('property_type', propertyType);
        formData.append('property_subtype', propertySubtype);
        formData.append('price', price);
        formData.append('location', location);
        formData.append('description', description);
        formData.append('bedroom', bedroom);
        formData.append('bathroom', bathroom);
        formData.append('size', size);
        formData.append('area', area);
        formData.append('parking', parking);
        formData.append('build_area', buildArea);
        formData.append('plot_up_area', plotUpArea);
        formData.append('furnishing_type', furnishing_type);
        formData.append('title_deed', title_deed);
        formData.append('apartment_number', apartmentNumber);
        formData.append('property_categories', saleOrRent);

        imagePaths.forEach((imageFile) => {
            formData.append('image_path', imageFile);
        });

        mediaPaths.forEach((mediaFile) => {
            formData.append('media_path', mediaFile);
        });

        videoPaths.forEach((videoFile) => {
            formData.append('video_path', videoFile);
        });

        propertydocumnetpaths.forEach((propertydocumentFile) => {
            formData.append('document_path', propertydocumentFile);
        });


        if (Object.values(amenities).flat().length > 0) {
            formData.append('amenities', JSON.stringify(amenities));
        }


        try {
            const agentId = localStorage.getItem('agentId');
            console.log('Agent ID:', agentId);
            console.log('Agent ID:', token);

            const response = await fetch(`https://a.khelogame.xyz/agent-add-property?agent_id=${agentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAmenityChange = (category, amenity) => {
        setAmenities((prevAmenities) => {
            const categoryAmenities = prevAmenities[category];
            if (categoryAmenities.includes(amenity)) {
                return {
                    ...prevAmenities,
                    [category]: categoryAmenities.filter(item => item !== amenity)
                };
            } else {
                return {
                    ...prevAmenities,
                    [category]: [...categoryAmenities, amenity]
                };
            }
        });
    };

    const amenityCheckbox = (category, label) => (
        <div className={styles.checkBoxDiv} key={label}>
            <input
                type="checkbox"
                onChange={() => handleAmenityChange(category, label)}
            />
            <label>{label}</label>
        </div>
    );

    const propertyCategories = {
        Residential: [
            'Apartment',
            'Townhouse',
            'Penthouse',
            'Residential Building',
            'Residential Villa',
            'Compound',
        ],
        Commercial: [
            'Office',
            'Retail',
            'Staff Accommodation',
            'Warehouse',
            'Commercial Building',
            'Commercial Villa',
            'Factory',
            'Showroom',
        ],
        Land: ['Residential Land', 'Commercial Land', 'Industrial Land', 'Agricultural Land'],
        MultipleUnits: ['Multiple Units'],
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Add Property</h2>
                <form className={styles.formMainBox} onSubmit={handleSubmit}>
                    {!propertyType && <div className={styles.propertyTypeBox}>
                        <h3>Select Property Type</h3>
                        <input type="radio" value="Residential" id="Residential" name='property_type' onChange={handlePropertyTypeChange} />
                        <label htmlFor="Residential"><Image width={60} height={60} src="/images/icon-land-1.png" alt='' /> Residential</label>
                        <input type="radio" value="Commercial" id="Commercial" name='property_type' onChange={handlePropertyTypeChange} />
                        <label htmlFor="Commercial"><Image width={60} height={60} src="/images/icon-land-2.png" alt=''/> Commercial</label>
                        <input type="radio" value="Land" id="Land" name='property_type' onChange={handlePropertyTypeChange} />
                        <label htmlFor="Land"><Image width={60} height={60} src="/images/icon-land-3.png" alt=''/> Land</label>
                        <input type="radio" value="MultipleUnits" id="MultipleUnits" name='property_type' onChange={handlePropertyTypeChange} />
                        <label htmlFor="MultipleUnits"><Image width={60} height={60} src="/images/icon-land-4.png" alt=''/> Multiple Units</label>
                    </div>
                    }
                    {propertyType && !propertySubtype && (
                        <div className={styles.propertyTypeBox2}>
                            <h3>Select Property Category</h3>
                            {propertyCategories[propertyType].map((subtype, index) => (
                                <>
                                    <input key={index} type="radio" value={subtype} id={subtype} name='property_category' onChange={(e) => setPropertySubtype(e.target.value)} />
                                    <label htmlFor={subtype}>{subtype}</label>
                                </>
                            ))}
                        </div>
                    )}
                    {propertySubtype &&
                        <>
                            <div className={styles.propertyFormBox}>
                                <h3>Basic Information</h3>
                                <input
                                    type="text"
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    placeholder="Add Property Title"
                                />
                                <textarea name="" id="" value={description} onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add Property Description" rows='5'></textarea>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Add Price"
                                />
                                <select value={saleOrRent} onChange={(e) => setSaleOrRent(e.target.value)}>
                                    <option value="">Select Listing Type</option>
                                    <option value="Rent">For Rent</option>
                                    <option value="Sale">For Sale</option>
                                </select>
                            </div>
                            <div className={styles.propertyFormBox2}>
                                <h3>Additional Details</h3>
                                <select value={bedroom} onChange={(e) => setBedroom(e.target.value)}>
                                    <option value="">Select Bedroom</option>
                                    {[...Array(11)].map((_, i) => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                                <select value={bathroom} onChange={(e) => setBathroom(e.target.value)}>
                                    <option value="">Select Bathroom</option>
                                    {[...Array(11)].map((_, i) => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                                <select
                                    value={furnishing_type}
                                    onChange={(e) => setFurnishing_type(e.target.value)}
                                >
                                    <option value="" disabled>Select Furnishing Type</option>
                                    <option value="Semi Furnished">Semi Furnished</option>
                                    <option value="Fully Furnished">Fully Furnished</option>
                                    <option value="Unfurnished">Unfurnished</option>
                                </select>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Add Location"
                                />
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    placeholder="Add Size"
                                />
                                <input
                                    type="text"
                                    value={parking}
                                    onChange={(e) => setParking(e.target.value)}
                                    placeholder="Enter Parking Details"
                                />
                                <input
                                    type="text"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    placeholder="Add Area"
                                />
                                <input
                                    type="text"
                                    value={buildArea}
                                    onChange={(e) => setBuildArea(e.target.value)}
                                    placeholder="Enter Building Area"
                                />
                                <input
                                    type="text"
                                    value={plotUpArea}
                                    onChange={(e) => setPlotUpArea(e.target.value)}
                                    placeholder="Enter Plot Up Area"
                                />
                                <input
                                    type="text"
                                    value={apartmentNumber}
                                    onChange={(e) => setApartmentNumber(e.target.value)}
                                    placeholder="Enter Apartment Number"
                                />
                            </div>
                            <div className={styles.propertyFormBox}>
                                <label>Add Property Images</label>
                                <input
                                    type="file"
                                    onChange={(e) => setMediaPaths(Array.from(e.target.files))}
                                    multiple
                                />
                                <label>Floor Map Images</label>
                                <input
                                    type="file"
                                    onChange={(e) => setImagePaths(Array.from(e.target.files))}
                                    multiple
                                />
                            </div>
                            <div className={styles.propertyFormBox3}>
                                <h3>Property Details</h3>
                                <label htmlFor="">Title Deed</label>
                                <input
                                    type="text"
                                    value={title_deed}
                                    onChange={(e) => setTitle_deed(e.target.value)}
                                    placeholder="Enter Title Deed"
                                />
                                <label htmlFor="">{`Owner's Passport Or ID`}</label>
                                <input
                                    type="file"
                                    onChange={(e) => setPropertyDocumentPaths(Array.from(e.target.files))}
                                />
                            </div>
                            <div className={styles.propertyFormBox2}>
                                <h3 className={styles.amenitiesText}>Select Amenities For This Property</h3>
                                <h4 className={styles.amenitiesNamesText}>Recreation And Family</h4>
                                <div className={styles.checkBoxBigBox}>
                                    {amenityCheckbox('recreationAndFamily', 'barbeque area')}
                                    {amenityCheckbox('recreationAndFamily', 'day care center')}
                                    {amenityCheckbox('recreationAndFamily', 'kids play area')}
                                    {amenityCheckbox('recreationAndFamily', 'lawn or garden')}
                                    {amenityCheckbox('recreationAndFamily', 'cafeteria or canteen')}
                                </div>
                                <h4 className={styles.amenitiesNamesText}>Health And Fitness</h4>
                                <div className={styles.checkBoxBigBox}>
                                    {amenityCheckbox('healthAndFitness', 'first aid medical center')}
                                    {amenityCheckbox('healthAndFitness', 'gym or health club')}
                                    {amenityCheckbox('healthAndFitness', 'jacuzzi')}
                                    {amenityCheckbox('healthAndFitness', 'sauna')}
                                    {amenityCheckbox('healthAndFitness', 'steam room')}
                                    {amenityCheckbox('healthAndFitness', 'swimming pool')}
                                </div>
                                <h4 className={styles.amenitiesNamesText}>Features</h4>
                                <div className={styles.checkBoxBigBox}>
                                    {amenityCheckbox('features', 'double glazed windows')}
                                    {amenityCheckbox('features', 'centrally air conditioned')}
                                    {amenityCheckbox('features', 'central heating')}
                                </div>
                                <h4 className={styles.amenitiesNamesText}>Cleaning And Maintenance</h4>
                                <div className={styles.checkBoxBigBox}>
                                    {amenityCheckbox('cleaningAndMaintenance', 'waste disposal')}
                                    {amenityCheckbox('cleaningAndMaintenance', 'maintenance staff')}
                                    {amenityCheckbox('cleaningAndMaintenance', 'cleaning services')}
                                </div>
                            </div>
                            <button type="submit" className={styles.submitBtn}>Add Property <i class='bx bxs-right-arrow-circle'></i></button>
                        </>}
                </form>
            </section>
        </>
    )
}

export default AddProperty