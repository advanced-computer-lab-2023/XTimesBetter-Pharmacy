import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './medicinalUsesDDL.module.css';

//components
import PharmacistMedicineDetails from '../../components/pharmacistMedicineDetails/pharmacistMedicineDetails';
import MedicineSearchBar from '../../components/medicineSearchBar/medicineSearchBar'

const MedicineCatalog = () => {
    const [medicines, setMedicines] = useState([]);

    //search related
    const [medicineName, setMedicineName] = useState('');
    //filter related
    const [medicinalUses, setMedicinalUses] = useState([]);
    const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('')
    //const [medicineFilterResult, setMedicineFilterResult] = useState([])
    //for display
    const [medicinesToBeDisplay, setMedicinesToBeDisplay] = useState([]);

    useEffect(() => {
        const fetchAllMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pharmacist/medicineCatalog', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // console.log('Response:', response);
                //console.log('Response Data:', response.data);
                if (response && response.data) {
                    setMedicines(response.data);
                    setMedicinesToBeDisplay(response.data) //so that initially all medicines are displayed

                    //get unique medicinal uses to populate the filter ddl
                    const uniqueMedicinalUses = [];
                    for (const med of response.data) {
                        for (const use of med.medicinalUses) {
                            if (!uniqueMedicinalUses.includes(use.toLowerCase())) {
                                uniqueMedicinalUses.push(use.toLowerCase())
                            }

                        }
                    }
                    setMedicinalUses(uniqueMedicinalUses);

                }
            } catch (error) {
                throw new Error('Invalid response data');
            }
        };

        fetchAllMedicines();

    }, []);

    //search function
    const handleSearch = (name) => {
        setMedicineName(name);
        const searchResult = medicines.filter((medicine) => medicine.name.toLowerCase().startsWith(name.toLowerCase()))
        setMedicinesToBeDisplay(searchResult)
        setSelectedMedicinalUse(" ");

    }
    //clear search
    const handleClearSearch = () => {
        setMedicinesToBeDisplay(medicines)
        setSelectedMedicinalUse(" ");
    }

    //filter function
    const handleFilter = (event) => {
        //console.log(event.target.value)
        setSelectedMedicinalUse(event.target.value);
        if (event.target.value === " ") {
            setMedicinesToBeDisplay(medicines)
        }
        else {
            //.some() was added to loop over the medicinal uses array and compare each use.toLowerCase with selectedUse [case insensitive filter]
            const filterResult = medicines.filter((medicine) => {
                return medicine.medicinalUses.some((use) =>
                    use.toLowerCase() === event.target.value.toLowerCase()
                );
            });
            setMedicinesToBeDisplay(filterResult)
        }

    };

    return (
        <>
            <h1 className={styles["list-title"]}>Medicines List</h1>
            <MedicineSearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            <div className={styles["ddl-container"]}>
                <label className={styles["ddl-label"]}>Select Medicinal Use:</label>
                <select className={styles["ddl-select"]} value={selectedMedicinalUse} onChange={handleFilter}>
                    <option value=" ">No filter</option>
                    {
                        medicinalUses && medicinalUses.map((use, index) => (
                            <option key={index} value={use}>
                                {use}
                            </option>
                        ))}
                </select>
            </div>
            < div className={styles["result-container"]}>
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price (LE)</th>
                            <th>Active Ingredients</th>
                            <th>Medicinal Uses</th>
                            <th>Sold</th>
                            <th>Available Quantity</th>
                            <th>Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            medicinesToBeDisplay && medicinesToBeDisplay.map((medicine) => {
                                return <PharmacistMedicineDetails key={medicine._id} medicine={medicine} />
                            })
                        }
                    </tbody>
                </table>
            </div >
        </>
    );
};

export default MedicineCatalog;
