import { useState, useEffect } from 'react';
import { Route } from "react-router-dom";
import axios from 'axios';
import { AppContext } from './context';
import Drawer from './components/Drawer';
import Header from './components/Header';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import './App.scss';


function App() {
  const [sneakers, setSneakers] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Мой вариант
  // useEffect(() => {
  //   request("https://64a6b1e5096b3f0fcc805642.mockapi.io/items")
  //     .then(data => setSneakers(sneakers => data))
  // }, [])

  // const request = useCallback(async (url) => {
  //   console.log("Jsdv")
  //   const result = await fetch(url);

  //   return await result.json();
  // }, []);

  // Вариант чувака
  useEffect(() => {
    // I. Вариант с fetch 
    // fetch("https://64a6b1e5096b3f0fcc805642.mockapi.io/items")
    //   .then(data => data.json())
    //   .then(data => setSneakers(sneakers => data))

    // I. Свое. Чисто по приколу сделал, возможно пригодится
    /*     async function fetchData() {
          const [items, favoritesDATA, cart] = await Promise.all([axios.get("https://64a6b1e5096b3f0fcc805642.mockapi.io/items"), axios.get("https://64a6b1e5096b3f0fcc805642.mockapi.io/favorites"), axios.get("https://64a6b1e5096b3f0fcc805642.mockapi.io/cart")])
          setSneakers(sneakers => items.data)
          setFavorites(favorites => favoritesDATA.data)
          setCartItems(cartItems => {
            return cart.data.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              src: item.src
            }))
          })
        }
    
        fetchData(); */
    // II. Вариант с axios
    /*     axios.get("https://64a6b1e5096b3f0fcc805642.mockapi.io/items")
          .then(res => setSneakers(sneakers => res.data)) */

    // Одновременный запрос и на всех товаров и на товаров, которые были добавлены в корзину
    /*     axios.get("https://64a6b1e5096b3f0fcc805642.mockapi.io/cart")
          .then(res => {
            return res.data.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              src: item.src
            }))
          })
          .then(data => setCartItems(cartItems => ([...cartItems, ...data])))
        axios.get("https://64a6b1e5096b3f0fcc805642.mockapi.io/favorites")
          .then(res => {
            if (res.statusText === "OK") {
              return setFavorites(favorites => res.data)
            } else {
              throw new Error(res)
            }
          })
          .catch(error => {
            throw error
          }) */

    // I. Метод чувака, который понял, что нужно делать одновременный запрос и дождаться всех результатов, иначе не будет работать уже добавленных корзинок и favorites. Типа запрос на sneakers может сработать быстрее, чем запрос на cart и в итоге cartItems будет пуст и эффект уже добавленных товаров не будет работаь
    async function fetchData() {
      // I. Делаем это, если бы мы делали данный запрос множество раз, потому что после получении данных у нас loading становится false и нам нужно снова показать, что идет запрос, а так у нас запрос данных идет только 1 раз нечего лишний раз перезагружать компоненты
      // setIsLoading(true);


      // II. Вместо Promise.all делаем лестничный await
      // Вот так тоже можно. Вместо Promise.all можно и так сделать, потому что await заставляет дальнейщих кодов стоять и ждать, пока не выполнится await и так по очереди
      const cartResponse = await axios.get("http://localhost:3001/cart");
      const favoritesResponse = await axios.get("http://localhost:3001/favorites");
      const itemsResponse = await axios.get("http://localhost:3001/items");

      setCartItems(cartItems => {
        return cartResponse.data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          src: item.src
        }))
      })
      setFavorites(favorites => favoritesResponse.data)
      setSneakers(sneakers => itemsResponse.data)
      setIsLoading(false);
    }

    fetchData();

  }, [])


  const onAddToCart = async (data) => {
    // I. Проверка уже существующих кроссовок в корзине, чтобы не дублировать из в корзине то есть в компоненте Drawer
    try {
      if (cartItems.find(sneaker => Number(sneaker.id) === Number(data.id))) {
        const res = await axios.delete(`http://localhost:3001/cart/${data.id}`)// - Только нужно добавить товар в корзинку на сервере, каждый раз когда пользователь добавляет что-то в свою корзинку, иначе при перезагрузки страницы и потом открытии корзинки все добавленные товары исчезнут.
        if (res.statusText === 'OK') {
          return setCartItems(cartItems => cartItems.filter(sneaker => Number(sneaker.id) !== Number(data.id)))
        }
      }
      else {
        const res = await axios.post(`http://localhost:3001/cart`, data)
        if (res.statusText === "Created") {
          return setCartItems(cartItems => ([...cartItems, { id: Number(res.data.id), name: res.data.name, price: res.data.price, src: res.data.src }]))
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // I. Удаление из корзины
  // Мой способ удаления из корзинки
  /*   const onDeleteFromCart = (data) => {
      const newCartItems = cartItems.filter(item => item.name !== data.name)
      setCartItems(cartItems => newCartItems);
    } */

  // II. Удаление из корзины
  // Способ чувака
  const onRemoveItem = (id) => {
    axios.delete(`http://localhost:3001/cart/${id}`)
      .then(res => {
        if (res.statusText === "OK") {
          return setCartItems(cartItems => cartItems.filter(item => item.id !== id));
        }
      })
  }

  // I. Можно было и использовать then catch. Здесь автор хотел просто разнообразить свой код. При использовании async await стоит писать try catch 
  const onAddToFavorite = async (item) => {
    try {
      // Проерка кроссовок только на странице /favorites, чтобы при нажатии на favorites не дублировались кроссовки
      if (favorites.find(sneaker => Number(sneaker.id) === Number(item.id))) {
        const res = await axios.delete(`http://localhost:3001/favorites/${item.id}`)
        if (res.statusText === "OK") {
          // Можно и не удалять из стейта, потому что пользователь может случайно нажать на кнопку favorite. Можешь это добавить на твой вкус
          return setFavorites(favorites => favorites.filter(sneaker => Number(sneaker.id) !== Number(item.id)));
        }
      }
      else {
        const res = await axios.post("http://localhost:3001/favorites", item)
        if (res.statusText === 'Created') {
          console.log("")
          console.log(res);
          return setFavorites(favorites => ([...favorites, { id: Number(item.id), name: res.data.name, price: res.data.price, src: res.data.src }]))
        }
      }
    } catch (error) {

      alert("Ошибка при добавлении в favorites");
    }

  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some(sneaker => Number(sneaker.id) === Number(id))
  }


  // I. Понятие Route и exact
  // Если на странице будет путь '/favorites/, то компонент Route будет рендерить все, что в нем находится.
  // II. Что такое exact
  // exact - значит, что он будет рендерить то, что находится в Route только если мы находимся по "/favorites" (то есть идет строгое сравнение). Если не указывать exact, то пользователь может и написать в адресной строке что-то вроде "/favoritesdsdjfbvndfg" или "/favorites/next/new", потому что в адресной строке есть путь "/favorites" и не важно что идет дальше в адресной строке (то есть без exact идет нестрогое сравнение). 
  /* 
    Строгое сравнение exact 
    есть exact path="/favorites" - Route будет рендерить то, что находится внутри него если в адресной строке будет только "/favorites"
    Несторогое сравнение без exact
    нет exact - Route будет рендерить все, что находится внутри него, даже если в адресной строке есть не только "/favorites" - к примеру - это 
    "/favoritesвагрмврамивримавпиапи" (потому что есть /favorites) или так "/favorites/news/somithing/dfvbdb"
  */

  /*   <Route path="/favorites" exact>
      <Header onClickCart={() => setCartOpened(true)} />
    </Route> */

  // II. Знак "/" - значит главная страница - первоначальная когда нет никаких дабалвений в адресной строке
  /*   <Route path="/" exact>
      <Header onClickCart={() => setCartOpened(true)} />
    </Route> */
  return (
    <AppContext.Provider value={{ favorites, sneakers, cartItems, isItemAdded, onAddToFavorite, setCartOpened, setCartItems }}>
      <div className="wrapper clear">
        {cartOpened && <Drawer onRemove={onRemoveItem} onCloseCart={() => setCartOpened(false)} items={cartItems} />}

        <Header onClickCart={() => setCartOpened(true)} />

        <Route exact path="/">
          <Home
            cartItems={cartItems}
            sneakers={sneakers}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToCart={onAddToCart}
            onAddToFavorite={onAddToFavorite}
            favorites={favorites}
            isLoading={isLoading} />
        </Route>

        <Route exact path="/favorites">
          <Favorites />
        </Route>

      </div>
    </AppContext.Provider>

  );
}

export default App;
