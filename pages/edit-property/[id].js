import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from "@/styles/AddProperty.module.css";
import { useRouter } from 'next/router';
import Image from 'next/image';

const EditProperty = () => {

    const router = useRouter();
    const { id } = router.query;
    const [propertyName, setPropertyName] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [propertySubtype, setPropertySubtype] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [imagePath, setImagePath] = useState(null);
    const [mediaPaths, setMediaPaths] = useState([]);
    const [videoPaths, setVideoPaths] = useState([]);
    const [propertyDocumentPaths, setPropertyDocumentPaths] = useState([]);
    const [token, setToken] = useState(null);
    const [amenities, setAmenities] = useState({
        recreationAndFamily: [],
        healthAndFitness: [],
        features: [],
        cleaningAndMaintenance: [],
    });
    const [bedroom, setBedroom] = useState('');
    const [size, setSize] = useState('');
    const [area, setArea] = useState('');
    const [parking, setParking] = useState('');
    const [bathroom, setBathroom] = useState('');
    const [buildArea, setBuildArea] = useState('');
    const [plotUpArea, setPlotUpArea] = useState('');
    const [furnishingType, setFurnishingType] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [titleDeed, setTitleDeed] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [propertySubtypes, setPropertySubtypes] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setToken(storedToken);
        }

        if (id) {
            fetchPropertyDetails(id);
        }
    }, [id]);

    const fetchPropertyDetails = async (propertyId) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/property/${propertyId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPropertyName(data.property_name);
                setPropertyType(data.property_type);
                setPropertySubtype(data.subtype_id.toString());
                setPrice(data.price);
                setLocation(data.location);
                setDescription(data.description);
                setImagePath(data.image_paths[0]); // Assuming single image for preview
                setMediaPaths(data.media_paths || []);
                setVideoPaths(data.video_paths || []);
                setPropertyDocumentPaths(data.document_paths || []);
                setAmenities(data.amenities || {
                    recreationAndFamily: [],
                    healthAndFitness: [],
                    features: [],
                    cleaningAndMaintenance: [],
                });
                setBedroom(data.bedroom.toString());
                setBathroom(data.bathroom.toString());
                setSize(data.size);
                setArea(data.area);
                setParking(data.parking.toString());
                setBuildArea(data.build_area);
                setPlotUpArea(data.plot_up_area);
                setFurnishingType(data.furnishing_type);
                setApartmentNumber(data.apartment_number);
                setTitleDeed(data.title_deed);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePropertyTypeChange = (e) => {
        const selectedType = e.target.value;
        setPropertyType(selectedType);
        setPropertySubtype('');
        setPropertySubtypes(propertyCategories[selectedType]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('property_name', propertyName);
        formData.append('property_type', propertyType);
        formData.append('subtype_id', propertySubtype); // Update subtype_id
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
        formData.append('furnishing_type', furnishingType);
        formData.append('apartment_number', apartmentNumber);
        formData.append('title_deed', titleDeed);

        if (imagePath) {
            formData.append('image_paths', imagePath); // Ensure correct field name
        }

        mediaPaths.forEach((mediaPath, index) => {
            formData.append(`media_paths[${index}]`, mediaPath);
        });

        videoPaths.forEach((videoPath, index) => {
            formData.append(`video_paths[${index}]`, videoPath);
        });

        propertyDocumentPaths.forEach((propertyDocumentPath, index) => {
            formData.append(`document_paths[${index}]`, propertyDocumentPath);
        });

        formData.append('amenities', JSON.stringify(amenities));


        try {
            const response = await fetch(`https://a.khelogame.xyz/update-property/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                router.push('/agent-panel/agent-property-list');
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


    const amenityCheckbox = (category, label) => {
        const categoryAmenities = amenities && amenities[category] ? amenities[category].map(item => item.amenity) : [];

        return (
            <div className={styles.checkBoxDiv} key={label}>
                <input
                    type="checkbox"
                    onChange={() => handleAmenityChange(category, label)}
                    checked={categoryAmenities.includes(label)}
                />
                <label>{label}</label>
            </div>
        );
    };

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

    const handleMediaPathChange = (files) => {
        const mediaArray = Array.from(files);
        setMediaPaths((prevMediaPaths) => [...prevMediaPaths, ...mediaArray]);
    };

    const handleVideoPathChange = (files) => {
        const videoArray = Array.from(files);
        setVideoPaths((prevVideoPaths) => [...prevVideoPaths, ...videoArray]);
    };

    const handleDocumentPathChange = (files) => {
        const documentArray = Array.from(files);
        setPropertyDocumentPaths((prevDocumentPaths) => [...prevDocumentPaths, ...documentArray]);
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Edit Property</h2>
                <form className={styles.formMainBox} onSubmit={handleSubmit}>
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
                            <div className={styles.formBox}>
                                <select value={propertyType} onChange={handlePropertyTypeChange} required>
                                    <option value="">Select Property Type</option>
                                    {Object.keys(propertyCategories).map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            {propertySubtypes.length > 0 && (
                                <div className={styles.formBox}>
                                    <label>Property Subtype</label>
                                    <select value={propertySubtype} onChange={(e) => setPropertySubtype(e.target.value)} required>
                                        <option value="">Select Property Subtype</option>
                                        {propertySubtypes.map((subtype) => (
                                            <option key={subtype} value={subtype}>{subtype}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                            {imagePath && (
                                <Image width={200} height={200} src={`https://a.khelogame.xyz/${imagePath}`} alt="Property Preview" className={styles.previewImage} />
                            )}
                            <input
                                type="file"
                                onChange={(e) => setImagePath(e.target.files[0])}
                                accept=".jpg,.jpeg,.png"
                            />
                            <label>Floor Map Images</label>
                            {mediaPaths.length > 0 && (
                                <div>
                                    <Image width={200} height={200}
                                        src={`https://a.khelogame.xyz/${mediaPaths[0]}`}
                                        alt="Media Preview"
                                        className={styles.previewImage}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => handleMediaPathChange(e.target.files)}
                                accept=".jpg,.jpeg,.png"
                            />
                            <label>Video Paths</label>
                            {videoPaths.map((videoPath, index) => (
                                <div key={`video_${index}`}>
                                    <video controls className={styles.previewVideo}>
                                        <source src={`https://a.khelogame.xyz/${videoPath}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleVideoPathChange(e.target.files)}
                                accept=".mp4,.gif"
                            />
                            <label>Document Paths</label>
                            {propertyDocumentPaths.map((documentPath, index) => (
                                <div key={`document_${index}`}>
                                    <a href={`https://a.khelogame.xyz/${documentPath}`} target="_blank" rel="noopener noreferrer">{documentPath}</a>
                                </div>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleDocumentPathChange(e.target.files)}
                                accept=".pdf"
                            />
                        </div>
                        <div className={styles.propertyFormBox3}>
                            <h3>Property Details</h3>
                            <label htmlFor="">Title Deed</label>
                            <input
                                type="text"
                                value={titleDeed}
                                onChange={(e) => setTitleDeed(e.target.value)}
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
                        <button type="submit" className={styles.submitBtn}>Add Property <i class="fa-solid fa-arrow-right"></i></button>
                    </>
                </form>
            </section>
        </>
    )
}

export default EditProperty