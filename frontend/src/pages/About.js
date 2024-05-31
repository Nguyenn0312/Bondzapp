import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Plot from 'react-plotly.js';
import axios from 'axios';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import config from '../config';
import Footer from '../components/Footer';

const StyledArrowDownwardIcon = styled(ArrowDownwardIcon)`
  color: red;
`;

const StyledArrowUpwardIcon = styled(ArrowUpwardIcon)`
  color: green;
`;

const About = () => {
  const [newsData, setNewsData] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const fetchNewsData = async () => {
    try {
      const apiKey = 'ad97680ed2e04dafa4f47a712d83098e';
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&pageSize=10`
      );
      setNewsData(response.data.articles);
      localStorage.setItem('newsData', JSON.stringify(response.data.articles));
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  const fetchBondData = async () => {
    try {
      const bondResponse = await axios.get(`${config.backendLocation}/bond`);
      setBonds(bondResponse.data);
    } catch (error) {
      console.error('Error fetching bond data:', error);
    }
  };

  useEffect(() => {
    const storedNewsData = localStorage.getItem('newsData');
    if (storedNewsData) {
      setNewsData(JSON.parse(storedNewsData));
    } else {
      fetchNewsData();
    }

    fetchBondData();
  }, []);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsData.length);
    }, 5000);
    return () => {
      clearInterval(newsInterval);
    };
  }, [newsData]);

  const handleUpdateNews = () => {
    fetchNewsData();
  };


  const generateTradeData = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    const dates = [];
    let currentDatePointer = startDate;
    while (currentDatePointer <= endDate) {
      const dateString = currentDatePointer.toISOString().slice(0, 10);
      dates.push(dateString);
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }
  
    const basePrices = dates.map(() => (Math.random() * 50 + 70).toFixed(2));
  
    const generateBondPrices = (basePrices, maxDifference) => {
      return basePrices.map(price => {
        const basePrice = parseFloat(price);
        const randomDifference = Math.random() * maxDifference - maxDifference / 2;
        return (basePrice + randomDifference).toFixed(2);
      });
    };
  
    const bondsData = Array(4).fill(null).map(() => generateBondPrices(basePrices, 20));
  
    return dates.map((date, index) => ({
      date,
      prices: bondsData.map(bondData => bondData[index])
    }));
  };
  
  const tradeData = generateTradeData();
  
  const bondTraces = bonds.slice(0, 4).map((bond, index) => ({
    type: 'scatter',
    mode: 'lines',
    name: bond.symbol,
    x: tradeData.map(data => data.date),
    y: tradeData.map(data => data.prices[index]),
    line: { color: `hsl(${index * 90}, 50%, 50%)` },
  }));

  return (
    <Container>
      <Header>
        <h3>Recommended Shares For You</h3>
        <Marquee>
          <MarqueeContent>
            <GridContainer>
              {bonds.concat(bonds).map((bond, index) => (
                <Card key={bond.id}>
                  <CardHeading>{bond.symbol}</CardHeading>
                  <CardPrice>{bond.price}</CardPrice>
                  <CardDescription>{bond.creditRating}</CardDescription>
                  {bond.price > 100 ? <UpIcon>▲</UpIcon> : <DownIcon>▼</DownIcon>}
                </Card>
              ))}
            </GridContainer>
          </MarqueeContent>
        </Marquee>
      </Header>

      <Main>
        <Content>
          <WishList>
            <LineGraph>
              <Plot
                data={bondTraces}
                layout={{
                  title: 'Most Traded Bonds Time Series',
                  xaxis: { title: '-' },
                  yaxis: { title: 'Highest Trade Price' },
                  paper_bgcolor: 'rgba(255, 255, 255, 0.1)',
                  plot_bgcolor: 'rgba(255, 255, 255, 0.1)',
                  font: { color: 'white' },
                  margin: {
                    t: 60, 
                    r: 30,
                    l: 50,
                    b: 50
                  },
                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
              />
            </LineGraph>
          </WishList>

          <News>
            <NewsWrapper>
              <NewsHeader>
                <h3>Latest News</h3>
                <UpdateNewsButton onClick={handleUpdateNews}>
                  Update News
                </UpdateNewsButton>
              </NewsHeader>
              {newsData.length > 0 && (
                <NewsSlideshow>
                  {newsData.map((article, index) => (
                    <NewsItem
                      key={index}
                      className={index === currentNewsIndex ? 'active' : ''}
                    >
                      <NewsImage src={article.urlToImage} alt={article.title} />
                      <NewsContent>
                        <NewsTitle>{article.title}</NewsTitle>
                        <NewsDescription>{article.description}</NewsDescription>
                        <NewsLink href={article.url} target="_blank">
                          Read More
                        </NewsLink>
                      </NewsContent>
                    </NewsItem>
                  ))}
                </NewsSlideshow>
              )}
            </NewsWrapper>
          </News>
        </Content>
      </Main>  
      <Footer />  
    </Container>
  );
};

const slide = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const Marquee = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    background: linear-gradient(to right, transparent 90%, #2C2C2C 100%);
  }
`;
const MarqueeContent = styled.div`
  display: flex;
  animation: ${slide} 60s linear infinite;
  width: 200%;
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Card = styled.div`
  background-color: #2C2C2C;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  margin-right: 20px;
  min-width: 200px;
`;

const CardHeading = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const CardPrice = styled.p`
  font-size: 24px;
  margin: 0;
  color: white;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: white;
`;

const UpIcon = styled.span`
  color: green;
  font-size: 24px;
`;

const DownIcon = styled.span`
  color: red;
  font-size: 24px;
`;

const News = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  flex-grow: 100%;
  flex-basis: 100%;
  width: 60vw;
  height: 45vh;
  border-radius: 10px;
  h3 {
    font-weight: 500;
    text-align: center;
    font-size: 15px;
  }
`;

const NewsWrapper = styled.div`
  padding: 10px;
`;

const NewsHeader = styled.div`
  font-family: "Georgia, serif";
  display: flex;
  justify-content: space-between;
  padding: 5px;
  h3 {
    font-weight: 500;
    font-size: 20px;
  }
`;

const NewsSlideshow = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
`;

const NewsItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.active {
    opacity: 1;
  }
`;

const NewsImage = styled.img`
  width: 40%;
  height: 50%;
  object-fit: cover;
  border-radius: 10px;
`;

const NewsContent = styled.div`
  position: absolute;
  bottom: 50%;
  left: 42%;
  border-radius: 10px;
  width: 58%;
  height: 50%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NewsTitle = styled.h4`
  margin-bottom: 10px;
  font-family: 'Trebuchet MS', sans-serif;
`;

const NewsDescription = styled.p`
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Trebuchet MS', sans-serif;
`;

const NewsLink = styled.a`
  color: white;
  text-decoration: none;
  font-family: 'Trebuchet MS', sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

const UpdateNewsButton = styled.button`
  padding: 5px 5px;
  border: unset;
  border-radius: 10px;
  border: 2px solid black;
  color: #212121;
  z-index: 1;
  background: #e8e8e8;
  position: relative;
  font-weight: 1000;
  font-size: 12px;
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: all 250ms;
  overflow: hidden;
  margin-bottom: 10px;

  &::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  border-radius: 5px;
  background-color: #212121;
  z-index: -1;
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: all 250ms;
  }
  
  &:hover {
  color: #e8e8e8;

  &::before {
    width: 100%;
    background: #5c36bb;
  }
}
`;

const LineGraph = styled.div`
  border-radius: 10px;
  width: 50vw;
  height: 45vh;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  color: white;
`;

const Main = styled.div`
  margin-inline: 10px;
`;

const Container = styled.div`
  margin-top: 80px;
  color: #fff;
  min-height: 100vh;
`;

const Header = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 20px 30px;
  font-family: 'Trebuchet MS', sans-serif;
  h3 {
    padding-bottom : 10px;
    font-size: 20px;
    font-weight: 400;
    font-family: "Georgia, serif";
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 10px;
  gap: 10px;
`;

const WishList = styled.div`
  width: 100%;
  height: 30em;
  display: flex;
`;

export default About;
