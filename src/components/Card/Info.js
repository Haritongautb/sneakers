import { useContext } from "react";
import { AppContext } from "../../context";
const Info = ({ title, description, image }) => {
    const { setCartOpened, setCartItems } = useContext(AppContext);

    return (
        <div className="cartEmpty d-flex align-center justify-center flex-column flex">
            <img className="mb-20" width="120px" src={image} alt="Cart empty" />
            <h2>{title}</h2>
            <p className="opacity-6">{description}</p>
            <button className="greenButton" onClick={() => setCartOpened(false)}>
                <img src="/img/arrow-left.svg" alt="Arrow left" />
                Вернуться назад
            </button>
        </div>
    )
}

export default Info;