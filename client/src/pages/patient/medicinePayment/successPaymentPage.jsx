// Axios
import axios from 'axios';

import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function SuccessPayment() {
    const navigate = useNavigate();
    const location = useLocation();
    //const receipt = location.state.receipt;
    const receipt= JSON.parse(sessionStorage.getItem('orderInfo'))
    // const accessToken = sessionStorage.getItem('accessToken');
    console.log(receipt);
    const handleSubmit = () => {
        sessionStorage.removeItem('cartItems');
        window.location.href = 'http://localhost:5173/patient';
    }

    //new part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');
    console.log(accessToken);
    useEffect(() => {
        if (username.length != 0) {
            setLoad(false);
        }
    }, [username]);
    async function checkAuthentication() {
        await axios({
            method: 'get',
            url: 'http://localhost:5000/authentication/checkAccessToken',
            headers: {
                "Content-Type": "application/json",
                'Authorization': accessToken,
                'User-type': 'patient',
            },
        })
            .then((response) => {
                // console.log(response);
                setUsername(response.data.username);
                //setLoad(false);
            })
            .catch((error) => {
                //setLoad(false);
                navigate('/login');

            });
    }

    const xTest = checkAuthentication();

    if (load) {
        return (<div>Loading</div>)
    }

    return (
        <div className="Success Payment">
            <h2>Success Payment</h2>
            <div>
                <h3>Order Information</h3>
                <div className="order-items" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ul>
                        {receipt && receipt.orderItems ? (
                            receipt.orderItems.map((item, index) => (
                                <li key={index}>
                                    <p>Medicine Name: {item.medName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price per Item: {item.price_per_item}</p>
                                </li>
                            ))
                        ) : (
                            <li>
                                <p>No order items available.</p>
                            </li>
                        )}
                    </ul>
                </div>
                <p>Delivery Address: {receipt.deliveryAddress}</p>
                <p>Payment through: {receipt.paymentMethod}</p>
                <p>Status: {receipt.status}</p>
            </div>
            <button onClick={() => handleSubmit()}>Proceed</button>
        </div>

    );

}

export default SuccessPayment; 