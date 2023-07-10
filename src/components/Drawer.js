import { useState, useContext } from "react";
import { AppContext } from "../context";
import axios from "axios";
import uniqid from 'uniqid';
import Info from "./Card/Info";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Drawer = ({ onRemove, onCloseCart, items = [] }) => {
    const { cartItems, setCartItems } = useContext(AppContext);
    const [orderID, setOrderID] = useState(null);
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onClickOrder = async () => {
        try {
            const randomOrderID = uniqid();
            setIsLoading(isLoading => true);
            const resPost = await axios.post("http://localhost:3001/orders", { id: randomOrderID, orderItems: cartItems })


            if (resPost.statusText === "Created") {
                setOrderID(orderID => randomOrderID)
                setIsOrderComplete(true);
                setCartItems([]);
            }

            // I. 
            // Также после создания заказа нужно удалить корзинку в базе данных. С этим нужно подумать как реализовать удаление полностью все в json server
            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                await axios.delete(`http://localhost:3001/cart/${item.id}`)
                // delay между запросами на delete, чтобы сервер не перенагружался
                await delay(1000);
            }
        } catch (error) {
            throw error;
        }
        finally {
            setIsLoading(isLoading => false);
        }
    }

    return (
        <div className="overlay">
            <div className="drawer">
                <h2 className="d-flex justify-between mb-30">
                    Корзина
                    <img className="removeBtn" src="/img/button-remove.svg" alt="Remove" onClick={onCloseCart} />
                </h2>

                {
                    items.length > 0 ?
                        <div className="d-flex flex-column flex">
                            <div className="items">
                                {
                                    items.map(({ name, price, src, id }) => {
                                        return (
                                            <div key={id} className="cartItem d-flex align-center mb-20">
                                                <div style={{ backgroundImage: `url(${src})` }} className="cartItemImg">

                                                </div>
                                                <div className="mr-20">
                                                    <p className="mb-5">
                                                        {
                                                            name
                                                        }
                                                    </p>
                                                    <b>{price} руб.</b>
                                                </div>
                                                <img onClick={() => onRemove(id)} className="removeBtn" src="/img/button-remove.svg" alt="Remove" />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="cartTotalBlock">
                                <ul>
                                    <li className="d-flex">
                                        <span>
                                            Итого:
                                        </span>
                                        <div></div>
                                        <b>{items.length && items.reduce((current, next) => current + next.price, 0)} руб.</b>
                                    </li>
                                    <li className="d-flex">
                                        <span>
                                            Налог 5%:
                                        </span>
                                        <div></div>
                                        <b>{Math.floor(((items.length && items.reduce((current, next) => current + next.price, 0)) / 100) * 5)} руб.</b>
                                    </li>
                                </ul>
                                <button onClick={onClickOrder} className="greenButton" disabled={isLoading}>
                                    Оформить заказ
                                    <img src="/img/arrow.svg" alt="Arrow" />
                                </button>
                            </div>
                        </div>

                        :

                        <Info
                            title={isOrderComplete ? "Заказ Оформлен" : "Корзина пустая"}
                            description={isOrderComplete ? `Ваш заказ # ${orderID} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ"}
                            image={isOrderComplete ? "/img/complete-order.jpg" : "/img/cart-empty.jpg"} />

                }


            </div>
        </div>
    )
}


export default Drawer;