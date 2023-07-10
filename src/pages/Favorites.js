import { useContext } from "react";
import { AppContext } from "../context";
import Card from "../components/Card";

const Favorites = () => {
    const { favorites, onAddToFavorite } = useContext(AppContext)

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои закладки</h1>
            </div>

            <div className="d-flex flex-wrap">
                {
                    favorites.length > 0 ? favorites.map(item => {
                        return <Card key={item.id}
                            favorited={true}
                            onFavorite={onAddToFavorite}
                            {...item} />
                    }) : null
                }
            </div>
        </div>
    )
}

export default Favorites;