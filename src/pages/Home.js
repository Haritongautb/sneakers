import Card from "../components/Card";
const Home = ({ cartItems, sneakers, searchValue, setSearchValue, onChangeSearchInput, onAddToCart, onAddToFavorite, favorites, isLoading }) => {
    /* Метод includes() определяет, содержит ли строка символы заданной строки.
Этот метод возвращает true, если строка содержит символы, и false если нет.
Примечание. Метод includes() чувствителен к регистру. */
    const renderItems = () => {

        const filtredItems = sneakers.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
        return (isLoading ? [...Array(8)] : filtredItems).map((item, index) => <Card
            key={isLoading ? index : item.id}
            onPlus={onAddToCart}
            onFavorite={onAddToFavorite}
            added={cartItems.some(sneaker => Number(sneaker.id) === Number(item.id))}
            favorited={favorites.some(sneaker => Number(sneaker.id) === Number(item.id))}
            loading={isLoading}
            {...item} />)
    };
    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Поиск по запросу "${searchValue}"` : "Все кроссовки"}</h1>
                <div className="search-block d-flex">
                    <img src="/img/button-search.svg" alt="Search" />
                    {searchValue && <img onClick={() => setSearchValue("")} className="clear cu-p" src="/img/button-remove.svg" alt="Clear" />}
                    <input value={searchValue} onChange={onChangeSearchInput} type="text" placeholder="Поиск..." />
                </div>
            </div>

            <div className="d-flex flex-wrap">
                {
                    renderItems()
                }
            </div>
        </div>
    )
}

export default Home;