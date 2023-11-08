import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './checkoutAddressPage.module.css';



const CheckoutAddress = () => {

    //for testing purposes 
    const cartItems = [{ "medName": "med123", "quantity": 1, "price_per_item": 7 }, { "medName": "Lisinopril", "quantity": 1, "price_per_item": 7.99 }, { "medName": "Amoxicillin", "quantity": 2, "price_per_item": 15.99 }]


    //existing address related
    const [existingAddresses, setExistingAddresses] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    // const [cartItems, setCartItems] = useState([]); //UNCOMMENT
    useEffect(() => {
        //UNCOMMENT
        //     const currentUrl = window.location.href;
        //     const urlSearchParams = new URLSearchParams(currentUrl);
        //     const cartItemsParam = urlSearchParams.get('cartItems');
        //     const parsedCartItems = JSON.parse(cartItemsParam);
        //     setCartItems(parsedCartItems);

        const fetchAllExistingAddresses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/patient/checkoutAddress/allExisting', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response && response.data) {
                    setExistingAddresses(response.data);
                }
            } catch (error) {
                throw new Error('Invalid response data');
            }
        };

        fetchAllExistingAddresses();
    }, []);

    const existingAddressesList = existingAddresses;

    //get total price of order
    let totalCartPrice = 0;
    for (const item of cartItems) {
        totalCartPrice += item.price_per_item * item.quantity;
    }

    //handle select existing address
    const handleSelectExistingAddress = (event) => {
        if (event.target.value !== "") {
            setDeliveryAddress(event.target.value);
        }
    };

    //handle if user chose "add new address"
    const handleAddNewAddress = () => {
        setIsAddingNewAddress(true);
    };

    //handle getting new address
    const handleNewAddressChange = (event) => {
        setDeliveryAddress(event.target.value);

    };

    //handle saving into db after save is clicked
    const handleSaveNewAddress = async () => {
        if (deliveryAddress === "" || deliveryAddress === " ") {
            return alert('Please enter a valid address!')
        }
        setIsAddingNewAddress(false); //since done addition of new address 
        if (existingAddresses.includes(deliveryAddress)) {
            return alert('This address already exists! Please select it directly from the list')
        }
        try {
            const response = await axios.post('http://localhost:5000/patient/checkoutAddress/addNew', { address: deliveryAddress });
            //alert('Address added successfully!')
            const updatedAddressesResponse = await axios.get('http://localhost:5000/patient/checkoutAddress/allExisting', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Update the state with the new list of addresses
            if (updatedAddressesResponse && updatedAddressesResponse.data) {
                setExistingAddresses(updatedAddressesResponse.data);
            }
        } catch (error) {
            console.error('Failed to add a new address:', error);
            throw error;
        }
    }

    //handle cancel in case user changes his mind about wanting to add new address
    const handleCancelNewAddress = () => {
        setIsAddingNewAddress(false);
        setDeliveryAddress('');
    };

    //redirect to payment
    const redirectToPayment = async () => {
        try {
            // Fetch cartItems from BE
            const response = await axios.get('http://localhost:5000/patient/checkoutAddress/payment');
            const cartItems = response.data.cartItems;
            const deliveryAddress = response.data.deliveryAddress;
            const queryParams = new URLSearchParams();
            queryParams.append('cartItems', JSON.stringify(cartItems));
            queryParams.append('deliveryAddress', deliveryAddress);

            // Redirect to the payment page with the query string
            window.location.href = `/patient/payment?${queryParams.toString()}`;
        } catch (error) {
            console.error('Error retrieving cartItems:', error);
        }
    };

    return (
        <>

            <h1>Checkout</h1>
            < div>
                <table className={styles["checkout-table"]}>
                    <thead>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>Price/Item (LE)</th>
                        <th>Total Price (LE)</th>
                    </thead>
                    <tbody>
                        {
                            cartItems && cartItems.map((item) => (
                                <tr key={item.medName}>
                                    <td>{item.medName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price_per_item}</td>
                                    <td>{item.price_per_item * item.quantity}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div >
            <div className={styles["totalprice-container"]}>
                Total: {totalCartPrice} LE
            </div>

            <div className={styles["Delivery-header"]}> Delivery Address </div>
            <div>
                {isAddingNewAddress ? (
                    <div>
                        <input className={styles["newAddress-input"]}
                            type="text"
                            placeholder="Enter new address"
                            value={deliveryAddress}
                            onChange={handleNewAddressChange}
                        />
                        <button className={styles["saveAddress-button"]} onClick={handleSaveNewAddress}>Save Address</button>
                        <button className={styles["cancel-button"]} onClick={handleCancelNewAddress}>Cancel</button>
                    </div>
                ) : (
                    <button className={styles["addAddress-button"]} onClick={handleAddNewAddress}>Add New Address</button>
                )}

            </div>
            <div className={styles["ddl-container"]}>
                <select className={styles["ddl-select"]} value={deliveryAddress} onChange={handleSelectExistingAddress}>
                    <option value=""> Select Delivery Address </option>
                    {
                        existingAddresses && existingAddresses.map((address, index) => (
                            <option key={index} value={address}>
                                {address}
                            </option>
                        ))}
                </select>
            </div>

            <button className={styles["proceedPayment-button"]} onClick={redirectToPayment}>Proceed To Payment</button>
        </>
    );
};

export default CheckoutAddress;