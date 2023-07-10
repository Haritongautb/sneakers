import { useContext } from "react";
import { AppContext } from "../context";
import { Link } from "react-router-dom";

const Header = ({ onClickCart }) => {
    const { cartItems } = useContext(AppContext);

    return (
        <header className="d-flex justify-between align-center p-40">
            <Link to="/">
                <div className="d-flex align-center">
                    <img width={40} height={40} src="/img/logo.png" />
                    <div>
                        <h3 className="text-uppercase">React Sneakers</h3>
                        <p className="opacity-5">Магазин лучших кроссовок</p>
                    </div>
                </div>
            </Link>

            <ul className="d-flex">
                <li className="mr-30 cu-p" onClick={onClickCart}>
                    <img width={18} height={18} src="/img/card.svg" alt="Cart" />
                    <span>{cartItems.length > 0 ? cartItems.reduce((current, next) => current + next.price, 0) : "0"} руб.</span>
                </li>
                <li className="mr-20 cu-p">
                    <Link to="/favorites">
                        <img width={21} height={19} src="/img/favorite.svg" alt="Favorites" />
                    </Link>
                </li>
                <li className="cu-p">
                    <img width={20} height={20} src="/img/user.svg" alt="User profile" />
                </li>
            </ul>
        </header>

    )
}

export default Header;