import { useEffect, useState } from 'react';
import './App.css';



function App() {
  const [basketArr, setBasketArr] = useState(localStorage.getItem('Products') ? JSON.parse(localStorage.getItem("Products")) : [])
  const [shopArr, setShopArr] = useState([])
  const [isloading, setIsloading] = useState(true)
  // const [isEmpty, setIsEmpty] = useState(true)


  useEffect(() => {
    localStorage.setItem('Products', JSON.stringify(basketArr))
  }, [basketArr])


  // calculate subtotal
  let subtotal = 0
  basketArr.forEach(element => {
    subtotal += element.total
  });


  // getting data 
  async function fetchData() {
    const res = await fetch('http://localhost:3000/hybridBikes')
    const data = await res.json()
    setShopArr(data)
    setIsloading(!isloading)
  }
  useEffect(() => {
    fetchData()
  }, [])



  // add card to basket
  function addBasket(x) {
    const element = basketArr.find(item => item.id === x.id)
    // setIsEmpty(!isEmpty)
    if (element) {
      element.count++
      element.total = element.count * element.price;
      setBasketArr([...basketArr])

    } else {
      const total = x.price
      setBasketArr([...basketArr, { ...x, count: 1, total: total }])

    }
  }

  // remove product
  function removeItem(id) {
    setBasketArr(basketArr.filter((x) => x.id !== id))
  }

  // increase and decrease count of product
  function modifyCount(isModify, item) {
    const element = basketArr.find(x => x.id === item.id)
    if (isModify) {
      element.count++
      element.total = element.count * element.price;
      setBasketArr([...basketArr])
    }
    else {
      if (element.count === 1) {
        return
      }
      element.count--
      element.total = element.count * element.price;
      setBasketArr([...basketArr])
    }
  }

  return (
    <>
      <div style={{ backgroundColor: "aqua" }}>
        {basketArr.length !== 0 ? <h1>Basket Products</h1> : <h1>Basket is empty</h1>}
        {basketArr && basketArr.map((x) =>

          <ul key={x.id}>
            <li>name: {x.title}</li>
            <li>price: {x.price}$</li>
            <li>quantity: {x.count}</li>
            <li>total Price: {x.total}</li>
            <button onClick={() => removeItem(x.id)}>remove</button>
            <button onClick={() => modifyCount(true, x)}>+</button>
            <button onClick={() => modifyCount(false, x)}>-</button>
          </ul>
        )}

        {basketArr.length !== 0 ? <h2>Subtotal: {subtotal}$ </h2> : <></>}


      </div>

      <h1>Products</h1>
      {isloading ? <p>Loading...</p> : <>
        {shopArr && shopArr.map((item) =>
          <ul key={item.id}>
            <li>{item.id}</li>
            <li>{item.title}</li>
            <li>{item.price}</li>
            <button onClick={() => addBasket(item)}>Add</button>
          </ul>
        )}
      </>}

    </>
  );
}

export default App;
