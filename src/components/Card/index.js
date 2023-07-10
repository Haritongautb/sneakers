import { useState, useContext } from "react";
import { AppContext } from "../../context";
import ContentLoader from "react-content-loader";
import styles from "./Card.module.scss";

const Card = ({ name, price, src, id, onPlus, onFavorite, favorited = false, added = false, loading = false }) => {
    // const { isItemAdded } = useContext(AppContext)
    const [isAdded, setIsAdded] = useState(added)
    const [isFavorite, setIsFavorite] = useState(favorited);

    const onClickPlus = () => {
        onPlus({ name, price, src, id });
        setIsAdded(isAdded => !isAdded);

    }

    const onClickFavorite = () => {
        onFavorite({ name, price, src, id })
        setIsFavorite(isFavorite => !isFavorite);
    }

    return (
        <div className={styles.card}>
            {
                loading ? <ContentLoader
                    speed={2}
                    width={155}
                    height={265}
                    viewBox="0 0 155 265"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb">
                    <rect x="1" y="0" rx="10" ry="10" width="155" height="155" />
                    <rect x="0" y="167" rx="5" ry="5" width="155" height="15" />
                    <rect x="0" y="187" rx="5" ry="5" width="100" height="15" />
                    <rect x="1" y="234" rx="5" ry="5" width="80" height="25" />
                    <rect x="124" y="230" rx="10" ry="10" width="32" height="32" />
                </ContentLoader> :
                    <>
                        <div className={styles.favorite} onClick={onClickFavorite}>
                            <img src={isFavorite ? "/img/heart-liked.svg" : "/img/heart-unliked.svg"} alt={isFavorite ? 'Liked' : "Unliked"} />
                        </div>
                        <img width={133} height={112} src={src} alt="Sneakers" />
                        <h5>{name}</h5>
                        <div className="d-flex justify-between align-center">
                            <div className="d-flex flex-column">
                                <span>
                                    Цена:
                                </span>
                                <b>{price} руб.</b>
                            </div>
                            <img className={styles.plus} onClick={onClickPlus} src={isAdded ? "/img/button-checked.svg" : "/img/plus.svg"} alt="Plus" />
                        </div>
                    </>

            }
        </div >
    )
}

export default Card;