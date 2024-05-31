import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FundCard from "../components/FundCard";
import styled from "styled-components";

const Fundpage = () => {
  // State to store fund data
  const [funds, setFunds] = useState([]);

  // Function to fetch fund data
  const fetchFunds = () => {
    // Mock API call or fetch data from an actual API
    const mockFunds = [
      {
        _id: 1,
        fundname: "XYZ Equity Fund",
        fundtype: "ABC Investment Management",
        fundManager: "AAA",
        fundInceptionDate: "2015-02-10",
        fundExpenseRatio: 0.85,
        fundAssets: 50000000,
      },
      {
        _id: 2,
        fundname: "ABC Growth Fund",
        fundtype: "DEF Asset Management",
        fundManager: "BBB",
        fundInceptionDate: "2016-07-21",
        fundExpenseRatio: 0.75,
        fundAssets: 75000000,
      },
      {
        _id: 3,
        fundname: "PQR Income Fund",
        fundtype: "GHI Investments",
        fundManager: "CCC",
        fundInceptionDate: "2017-03-12",
        fundExpenseRatio: 0.9,
        fundAssets: 30000000,
      },
      {
        _id: 4,
        fundname: "MNO Balanced Fund",
        fundtype: "JKL Investment Solutions",
        fundManager: "DDD",
        fundInceptionDate: "2018-09-05",
        fundExpenseRatio: 1.1,
        fundAssets: 40000000,
      },
      {
        _id: 5,
        fundname: "XYZ Small Cap Fund",
        fundtype: "ABC Investment Management",
        fundManager: "EEE",
        fundInceptionDate: "2019-11-30",
        fundExpenseRatio: 0.95,
        fundAssets: 25000000,
      },
      {
        _id: 6,
        fundname: "DEF Large Cap Fund",
        fundtype: "FGH Asset Management",
        fundManager: "FFF",
        fundInceptionDate: "2020-05-18",
        fundExpenseRatio: 0.8,
        fundAssets: 60000000,
      },
      {
        _id: 7,
        fundname: "GHI Growth Fund",
        fundtype: "JKL Investments",
        fundManager: "GGG",
        fundInceptionDate: "2021-01-09",
        fundExpenseRatio: 1.2,
        fundAssets: 35000000,
      },
      {
        _id: 8,
        fundname: "JKL Dividend Fund",
        fundtype: "MNO Investment Solutions",
        fundManager: "HHH",
        fundInceptionDate: "2022-08-24",
        fundExpenseRatio: 1.05,
        fundAssets: 45000000,
      }
      // Add the rest of the fund objects here...
    ];
    setFunds(mockFunds);
  };

  // Fetch fund data on component mount
  useEffect(() => {
    fetchFunds();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-600 bg-gradient-to-r pt-6 pb-12">
      <div className="flex items-center justify-center flex-wrap gap-12">
        {/* Map each set of four funds to a Container */}
        {funds.map((fund, index) => (
          index % 4 === 0 && (
            <Container key={index}>
              {funds.slice(index, index + 4).map((fund) => (
                <Link to={`/explore/${fund._id}`} key={fund._id}>
                  <FundCard {...fund} />
                </Link>
              ))}
            </Container>
          )
        ))}
      </div>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

export default Fundpage;
