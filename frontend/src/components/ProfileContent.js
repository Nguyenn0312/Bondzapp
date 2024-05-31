import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Plot from "react-plotly.js";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import config from "../config";

const StyledArrowDownwardIcon = styled(ArrowDownwardIcon)`
  color: red;
`;

const StyledArrowUpwardIcon = styled(ArrowUpwardIcon)`
  color: green;
`;

function ProfileContent() {
  const [bonds, setBonds] = useState([]);
  const [userBalance, setUserBalance] = useState(10000); // Assuming a fixed balance for demonstration
  const [fundSpent, setFundSpent] = useState(0); // Random value
  const [bondMaturityData, setBondMaturityData] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [transactionPerformance, setTransactionPerformance] = useState({});
  const [tradingEfficiency, setTradingEfficiency] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await axios.get(`${config.backendLocation}/analysis/user-performance`, {
          headers: { token: localStorage.token },
        });
        setTransactionPerformance(response.data);
      } catch (error) {
        console.error("Error fetching performance data:", error.response ? error.response.data : error);
      }
    };

    const fetchBondMaturityData = async () => {
      try {
        const response = await axios.get(`${config.backendLocation}/analysis/bond/maturity`, {
          headers: { token: localStorage.token },
        });
        setBondMaturityData(response.data);
      } catch (error) {
        console.error("Error fetching bond maturity data:", error.response ? error.response.data : error);
      }
    };

    fetchPerformance();
    fetchBondMaturityData();
    setFundSpent(Math.floor(Math.random() * 10000));
  }, []); // Empty dependency array means this runs once when the component mounts

  function TransactionChart({ performance }) {
    // Add a check to ensure 'performance' has the required properties
    if (!performance || !performance.totalOrders) {
      return <div>Loading...</div>;
    }
    
    return (
      <Plot
        data={[
          {
            x: ['Total Orders', 'Total Amount', 'Average Order Value'],
            y: [performance.totalOrders, performance.totalAmount, performance.averageOrderValue],
            type: 'bar'
          }
        ]}
        layout={{
          title: 'User Transaction Performance',
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: 'white' },
          width: window.innerWidth * 0.45, // Set width to 50% of the window width
          height: window.innerHeight * 0.45 // Set height to 50% of the window height
        }}
      />
    );
  }

  return (
    <Content>
      <Data>
        <DataPie>
          <Plot
            data={[
              {
                labels: bonds.map(bond => bond.symbol),
                values: bonds.map(bond => bond.price.reduce((a, b) => a + b, 0)),
                type: 'pie',
                marker: { colors }
              }
            ]}
            layout={{
              title: "Total Trading Cost for Each Bond",
              showlegend: true,
              legend: { font: { color: "white" }, x: 0.5, y: 0.5 },
              paper_bgcolor: "rgba(0,0,0,0)",
              width: 300,
              height: 300
            }}
          />
         {/*<div>Balance: ${userBalance}</div>*/}
         {/*<div>Fund Spent: ${fundSpent}</div>*/}
        </DataPie>
        <MyStocks>  
          <Table>
          <table>
          <thead>
            <tr>
              <th>Bond</th>
              <th>Total Quantity</th>
              <th>Total Buy Price</th>
              <th>Total Coupon Amount</th>
              <th>Total Amount at Maturity</th>
            </tr>
          </thead>
          <tbody>
            {bondMaturityData.map((data) => (
              <tr key={data.bondId}>
                <td>{data.bondName}</td>
                <td>{data.totalQuantity}</td>
                <td>{data.totalBuyPrice}</td>
                <td>{data.totalCouponAmount}</td>
                <td>{data.totalAmountAtMaturity}</td>
                </tr>
                ))}     
                {[...Array(Math.max(0, 3))].map((_, index) => (
                <tr key={`blank-${index}`}>
                <td colSpan="5">&nbsp;</td>
                </tr>
            ))}
          </tbody>
          </table>
        </Table>
        </MyStocks>
      </Data>

      <WishList>
        <Widget>
          <h2>Average Price: ${averagePrice}</h2>
          <h2>Transaction Performance</h2>
          <div>Total Orders: {transactionPerformance.totalOrders}</div>
          <div>Total Amount: ${transactionPerformance.totalAmount}</div>
          <div>Average Order Value: ${transactionPerformance.averageOrderValue}</div>
          <h2>Trading Efficiency</h2>
          <div>Total Trades: {tradingEfficiency.totalTrades}</div>
          <div>Total Buys: {tradingEfficiency.totalBuys}</div>
          <div>Total Sells: {tradingEfficiency.totalSells}</div>
          <div>Average Buy Price: ${tradingEfficiency.averageBuyPrice}</div>
          <div>Average Sell Price: ${tradingEfficiency.averageSellPrice}</div>
          <div>Efficiency: ${tradingEfficiency.efficiency}</div>
        </Widget>
        <Transact>
          <TransactionChart performance={transactionPerformance} />
        </Transact>
      </WishList>
    </Content>
  );
}

const colors = ["#0f3b5e", "#B90E50", "#D92525"];

const Content = styled.div`
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1em;
  overflow: auto;
`;

const Data = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  flex-wrap: wrap;
  justify-content: start;
  margin-top: 2em;
  margin-left: 1em;
`;

const DataPie = styled.div`
  display: flex;
  height: 100%;
  width: 45%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  justify-content: start;
  text-align: center;
  div {
    color: white;
  }
`;

const MyStocks = styled.div`
  width: 50%;
  height: 50%;
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 0.5em;
  
`;
const Title = styled.h1`
  width: 60%;
  font-size: 15px;
`;
const WishList = styled.div`
  width: 100%;
  height: 35%;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin-left: 1em;
`;

const Widget = styled.div`
  border-radius: 10px;
  width: 45%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  justify-content: start;
  padding: 10px;
  font-size: 12px;
  margin-top: 1em;
`;
const Transact = styled.div`
  border-radius: 10px;
  width: 40%;
  height: 50%;
  color: white;
  font-size: 12px;
  margin-top: 1em;
`;


const Table = styled.table`
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 20px; 
  border-collapse: collapse;
  color: white;
  font-size: 13px;
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  thead {
    background-color: #202020;
    position: sticky;
    top: 0;
    tr{
      font-size: 10px;
    }
    
  }
  th, td {
    padding: 10px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 10px;
    border-spacing: 0;
  }
  th {
    color: #fff;
    font-size: 12px;
    font-weight: 400;
  }
  td {
    background-color: #2C2C2C;
    margin: 20px;
    white-space: nowrap;
    overflow: hidden;
    color: #fff;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  th {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
`;

export default ProfileContent;
