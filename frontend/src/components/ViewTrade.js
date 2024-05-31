import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ViewBond from './ViewBond';
import config from "../config";

const Sells = [
  { id: 1, name: "Market" },
  { id: 2, name: "Limit" },
];

const userData = {
  Quantity: "1",
  Price: "0",
};

const ViewTrade = ({ setModal, modal, bond, balance }) => {
  const [btns, setBtn] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [formData, setForm] = useState(userData);
  const [Block, setBlock] = useState(false);
  const [sell, setSells] = useState(false);
  const [owned, setOwned] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedBond, setSelectedBond] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showOwnerWarning, setShowOwnerWarning] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [canPlaceOrder, setCanPlaceOrder] = useState();

  useEffect(() => {
    if (bond && bond._id) {
      axios.get(`${config.backendLocation}/bond/my-count/${bond._id}`, {
        headers: { token: localStorage.token },
      }).then((res) => {
        setOwned(res.data.count);
        setForm((prev) => ({
          Quantity: res.data.count.toString(),
          Price: bond.price,
        }));
        setSelectedBond(bond);
        setShowOwnerWarning(owned < formData.Quantity);
      });
    }
  }, [bond, balance]);

  const handlerBtns = (id) => {
    setBtn(id);
  };

  const handlerInput = (e) => {
    const { name, value } = e.target;

    if (name === "Quantity" && value === "") {
      setForm((prev) => ({ ...prev, [name]: "0" }));
    } else if (name === "Price" && value === "") {
      setForm((prev) => ({ ...prev, [name]: "0" }));
    } else if (!isNaN(value) && value.trim() !== '') {
      setForm((prev) => {
        let updatedForm = { ...prev, [name]: value };
        const newTotalPrice = parseFloat(updatedForm.Quantity) * parseFloat(updatedForm.Price);
        setTotalPrice(newTotalPrice);
        return updatedForm;
      });
    } else {
      console.error(`Invalid input value for ${name}: ${value}`);
    }
  };

  const handleBondClick = (bond) => {
    setSelectedBond(bond);
  }

  useEffect(() => {
    if (selectedBond) {
      console.log('selectedBond in ViewTrade:', selectedBond);
    }
  }, [selectedBond]);

  const handlerClose = () => {
    setBlock(false);
    setModal("close");
  };

  const handleQuantityChange = (type) => {
    setForm((prev) => {
      const newQuantity = type === "increment"
        ? parseInt(prev.Quantity) + 1
        : Math.max(parseInt(prev.Quantity) - 1, 0);
      const newTotalPrice = newQuantity * parseFloat(prev.Price);
      setTotalPrice(newTotalPrice);
      return { ...prev, Quantity: newQuantity.toString() };
    });
  };

  const handlePriceChange = (type) => {
    setForm((prev) => {
      const newPrice = type === "increment"
        ? (parseFloat(prev.Price) + 0.01).toFixed(2)
        : Math.max(parseFloat(prev.Price) - 0.01, 0).toFixed(2);
      const newTotalPrice = parseFloat(formData.Quantity) * parseFloat(newPrice);
      setTotalPrice(newTotalPrice);
      return { ...prev, Price: newPrice.toString() };
    });
  };

  const handleOrder = async (type) => {
    setShowWarning(false);
    setIsBuying(type === "buy");
    setIsSelling(type === "sell");
  
    try {
      const response = await axios.post(
        `${config.backendLocation}/order/`,
        {
          quantity: parseInt(formData.Quantity),
          price: parseFloat(formData.Price),
          total_price: totalPrice,
          bond: bond._id,
          type: type,
          isFixed: formData.Price !== "",
        },
        { headers: { token: localStorage.token } }
      );
  
      if (response.status === 200) {
        setOrderSuccess("Order placed successfully!");
        setOrderError("");
        setTimeout(() => {setOrderSuccess("");}, 3000);
        setForm(userData);
        setTotalPrice(0);
      }
    } catch (error) {
      setOrderError(
        "Error, " + (error.response?.data?.msg || error.message)
      );
      setOrderSuccess("");
      setTimeout(() => {setOrderError("")}, 3000);
    }
  };  
  return (
    <>
      {modal === "open" && (
        <Container setModal={setModal} modal={modal} bond={selectedBond} balance={balance}>
          <ViewBond bond={selectedBond} />
          <Box>
            <Bell>
              <p style={{ color: "#000" }}>$ {balance}</p>
              <button onClick={handlerClose}>
                <CloseIcon />
              </button>
            </Bell>
            <Navigate>
              <p style={{ color: "#000" }}>Owned Quantity : {owned}</p>
              <Btns1 onClick={() => handleOrder("buy")}>
                Buy
              </Btns1>
              <Btns1 onClick={() => handleOrder("sell")}>
                Sell
              </Btns1>
            </Navigate>
            {!sell && (
              <>
                <Inputs>
                  <label htmlFor="Quantity">Quantity</label>
                  <InputGroup>
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={formData.Quantity === 0}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      placeholder="Enter Quantity"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={handlerInput}
                    />
                    <button onClick={() => handleQuantityChange("increment")}>
                      +
                    </button>
                  </InputGroup>
                </Inputs>
                <Inputs>
                  <label htmlFor="Price">Price</label>
                  <InputGroup>
                    <button onClick={() => handlePriceChange("decrement")}>
                      -
                    </button>
                    <input
                      type="text"
                      placeholder="Enter Price"
                      name="Price"
                      value={formData.Price}
                      onChange={handlerInput}
                    />
                    <button onClick={() => handlePriceChange("increment")}>
                      +
                    </button>
                  </InputGroup>
                </Inputs>
                <Inputs>
                  <label htmlFor="TotalPrice">Total Price</label>
                  <InputGroup>
                    <input
                      type="text"
                      placeholder="Total Price"
                      name="TotalPrice"
                      value={totalPrice.toFixed(2)}
                      readOnly
                    />
                  </InputGroup>
                </Inputs>
              </>
            )}
            <WarningMessage show={showWarning}>
              {orderError && <p>{orderError}</p>}
            </WarningMessage>
            <StatusMessage show={showWarning}>
              {orderSuccess && <p>{orderSuccess}</p>}
            </StatusMessage>
          </Box>
        </Container>
      )}
    </>
  );
};

const Bell = styled.div`
  color: #000;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 3px;
    border-radius: 50%;
    svg {
      font-size: 30px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const flickerAnimation = keyframes`
  0% { opacity: 1; }
  10% { opacity: 0.9; }
  20% { opacity: 1; }
  30% { opacity: 0.5; }
  40% { opacity: 1; }
  50% { opacity: 0.7; }
  60% { opacity: 1; }
  70% { opacity: 0; }
  80% { opacity: 0.8; }
  90% { opacity: 0; }
  100% { opacity: 0; }
`;
const WarningMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 10px;
  //animation: ${flickerAnimation} 8s linear forwards;
`;
const StatusMessage = styled.div`
  color: ${props => props.error ? 'red' : 'green'};
  background-color: #f4f4f4;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  //animation: ${flickerAnimation} 8s linear forwards;
`;
const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 10px 0;
  margin-top: 15px;
  input {
    padding: 15px;
    outline: none;
    border: 1px solid #cccccc;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #000;
    &::placeholder {
      color: #000;
    }
  }
  label {
    position: absolute;
    background-color: #fff;
    color: grey;
    top: -10px;
    left: 10px;
    font-size: 12px;
    padding: 3px 5px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 5px;

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 5px 5px;
  }

  button {
    background-color: #f2f2f2;
    border: none;
    outline: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
`;

const Break = styled.div`
  padding: 10px;
`;

const Box = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 450px;
  height: 100%;
  max-height: 400px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  transition: all 0.5s ease-in-out;
  
  h1 {
    color: #1a1a1a;
    text-align: center;
    font-size: 20px;
  }
  h3 {
    color: #666666;
    font-weight: 400;
    font-size: 18px;
  }
`;

const Navigate = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Btns = styled.button`
  padding: 10px;
  flex-grow: 1;
  background-color: #fff;
  background-color: #000;
  color: grey;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border: 2px solid #0db3d4;
  border-radius: 5px;
  color: #fff;
`;

const Btns1 = styled(Btns)`
  background-color: #b90e50;
  border: none;
  color: #fff;

  &:nth-child(2) {
    background: rgb(25, 118, 210);
  }
`;

export default ViewTrade;