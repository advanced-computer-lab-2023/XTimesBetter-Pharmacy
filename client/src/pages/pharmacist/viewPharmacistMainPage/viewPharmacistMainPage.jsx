import React from 'react';

// Styles
import styles from './viewPharmacistMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AddMedicine from '../../medicine/medicineAdd';
import EditMedicine from '../../medicine/madicineEdit';
import PharmacistRequest from '../pharmacistRequestPage';
import MedicineCatalog from '../medicineCatalogPage';

// Components
import { Navbar } from '../../../components/navbar/navbar';

export const ViewPharmacistMainPage = () => {
    const list = [
        {
            url: "/pharmacist/pharmacistRequest",
            pageName: "Pharmacist Request",
        },
        {
            url: "/pharmacist/medicineCatalog",
            pageName: "Medicines List",
        },
        {
            url: "/addMedicine",
            pageName: "Add Medicine",
        },
        {
            url: "/editMedicine",
            pageName: "Edit Medicine",
        },
    ];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Pharmacist" list={list} />
            <>
                <Routes>
                    <Route path="/pharmacistRequest" element={<PharmacistRequest />} />
                    <Route path="/medicineCatalog" element={<MedicineCatalog />} />
                    <Route path="/addMedicine" element={<AddMedicine />} />
                    <Route path="/editMedicine" element={<EditMedicine />} />
                </Routes>
            </>
        </div>
    )
}