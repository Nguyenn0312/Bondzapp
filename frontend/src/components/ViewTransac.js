import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ViewBond from './ViewBond';
import config from "../config";

const Sells = [
  {
    id: 1,
    name: "Market",
  },
  {
    id: 2,
    name: "Limit",
  },
];

const userData = {
  Quantity: 0,
  Price: 0,
};

const ViewTrade = ({ setModal, modal, bond, balance }) => {
  const [btns, setBtn] = useState("");
  const [formData, setForm] = useState(userData);
  const [Block, setBlock] = useState(false);
  const [sell, setSells] = useState(false);
  const [owned, setOwned] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedBond, setSelectedBond] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [canPlaceOrder, setCanPlaceOrder] = useState(false);

  useEffect(() => {
    if (bond && bond._id)
      axios
        .get(`${config.backendLocation}/bond/my-count/${bond._id}`, {
          headers: { token: localStorage.token },
        })
        .then((res) => {
          setOwned(res.data.count);
          setMaxQuantity(Math.floor(balance / bond.price));
          setTotalPrice(formData.Quantity * bond.price);
          setSelectedBond(bond);
        });
  }, [bond, balance, formData.Quantity]);

  useEffect(() => {
    setShowWarning(totalPrice > balance);
    setCanPlaceOrder(totalPrice > 0);
  }, [totalPrice, balance]);

  const handlerBtns = (id) => {
    setBtn(id);
  };

  const handlerInput = (e) => {
    const { name, value } = e.target; 
  if (name === "Price" && !isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      setTotalPrice(0);
    } else if (!isNaN(value)) {
      setForm((prev) => {
        const newQuantity = name === "Quantity" ? Math.max(parseInt(value.replace(/^0+/, "")), 0) : prev.Quantity;
        const newPrice = name === "Price" ? value.replace(/^0+/, "") : prev.Price;
        const newTotalPrice = newQuantity * parseFloat(newPrice);
        setTotalPrice(newTotalPrice);
        return {
          ...prev,
          [name]: name === "Quantity" ? newQuantity : newPrice,
        };
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
      const newQuantity =
        type === "increment"
          ? Math.min(parseInt(prev.Quantity) + 1, maxQuantity)
          : Math.max(parseInt(prev.Quantity) - 1, 0);
      const newTotalPrice = newQuantity * parseFloat(prev.Price);
      setTotalPrice(newTotalPrice);
      return {
        ...prev,
        Quantity: newQuantity.toString(),
      };
    });
  };

  const handlePriceChange = (type) => {
    setForm((prev) => {
      const newPrice =
        type === "increment"
          ? (parseFloat(prev.Price) + 0.01).toFixed(2)
          : Math.max(parseFloat(prev.Price) - 0.01, 0).toFixed(2);
      const newTotalPrice = parseFloat(formData.Quantity) * parseFloat(newPrice);
      setTotalPrice(newTotalPrice);
      return {
        ...prev,
        Price: newPrice.toString(),
      };
    });
  };

  const handleOrder = (type) => {
    if (canPlaceOrder) {
        const numericPrice = parseFloat(formData.Price); // Chuyển đổi price thành số
        axios.post(
            `${config.backendLocation}/order/`,
            {
                quantity: parseInt(formData.Quantity), // Chuyển đổi Quantity thành số nguyên
                price: numericPrice,
                total_price: totalPrice,
                bond: bond._id,
                type: type,
                isFixed: formData.Price !== "",
            },
            {
                headers: {
                    token: localStorage.token,
                },
            }
        );
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
			  <Btns1 onClick={() => {
               handleOrder("buy");
               }}>
               Buy
              </Btns1>
              <Btns1 onClick={() => {
              handleOrder("sell");
              }}>
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
                      placeholder="Enter Quantity..."
                      id="Quantity"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={handlerInput}
                      autoComplete="off"
                    />
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      disabled={formData.Quantity >= maxQuantity}
                    >
                      +
                    </button>
                  </InputGroup>
                </Inputs>

                <Inputs>
                  <label htmlFor="Price">Price $</label>
                  <InputGroup>
                    <button
                      onClick={() => handlePriceChange("decrement")}
                      disabled={formData.Price === 0}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      placeholder="Enter Price..."
                      id="Price"
                      name="Price"
                      value={formData.Price}
                      onChange={handlerInput}
                      autoComplete="off"
                    />
                    <button onClick={() => handlePriceChange("increment")}>+</button>
                  </InputGroup>
                </Inputs>

                <Inputs>
                  <label htmlFor="TotalPrice">Total Price</label>
                  <input
                    type="text"
                    placeholder="Total Price"
                    id="TotalPrice"
                    name="TotalPrice"
                    value={totalPrice.toFixed(1)}
                    disabled
                  />
                </Inputs>

                {showWarning && (
                  <WarningMessage>
                    Your total price exceeds your balance. Please adjust the
                    quantity or price.
                  </WarningMessage>
                )}
              </>
            )}
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
const WarningMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 10px;
`;


const Inputs = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	margin: 10px 0;
	margin-top: 15px;
	input {
		padding: 10px;
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
    padding: 0 5px;
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
	/* background-color: #151525; */
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
	/* background-color: red; */
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
	/* transition: all 0.3s ease-in-out; */

	&:nth-child(2) {
		background: rgb(25, 118, 210);
	}
`;

export default ViewTrade;
