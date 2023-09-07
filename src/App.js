import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connect,
  disconnectWallet,
} from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";

import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len
    ? `${input.substring(0, len)}...${input.substring(39)}`
    : input;

export const StyledButton = styled.button`
  padding: 8px 20px;
  border-radius: 10px;
  border: none;
  background-color: var(--secondary);

  font-weight: bold;
  color: var(--secondary-text);

  font-size: 30px;
  cursor: pointer;

  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
    width: 50%;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`

  padding: 50px 0px;
  width: 360px;
  @media (min-width: 900px) {
    width: 450px;
  }
  @media (min-width: 1000px) {
    width: 900px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [isOpened, setIsOpened] = useState(false);

  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(1)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`The ${CONFIG.NFT_NAME} Passport is now yours`);
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      {!isOpened && (
        <s.Container
          flex={1}
          ai={"center"}
          style={{ padding: 24, backgroundColor: "var(--primary)" }}
          image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.jpg" : null}
        >
          <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
            <s.Container flex={2} jc={"center"} ai={"center"} style={{}}>
              <s.Container
                flex={2}
                jc={"center"}
                ai={"center"}
                style={{}}
                className="firstBox"
              >
                {/* <s.TextTitle
                  style={{
                    fontSize: 70,
                    marginTop: -45,
                    textAlign: "center",
                  }}
                >
                  Nation of Nowhere
                </s.TextTitle> */}
                              <StyledImg
                className=" img-fluid fluid"
                style={{
                  marginTop: "-100px",

                }}
                src="/config/images/NONLOGO.png"
              ></StyledImg>
                <div className="box">
                  <StyledButton className="boxTitle" onClick={toggle}>
                    Connect
                  </StyledButton>
                </div>
              </s.Container>
            </s.Container>
          </ResponsiveWrapper>
        </s.Container>
      )}

      {isOpened && (
        <s.Container
          flex={1}
          className="boxContent"
          ai={"center"}
          style={{ padding: "40px", backgroundColor: "black" }}
        >
          <s.SpacerSmall />
          <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
            <s.SpacerLarge />

            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                borderRadius: 24,
              }}
            >
              {/* <s.TextTitle
                style={{
                  fontSize: 40,
                  marginTop: -45,
                  textAlign: "center",
                }}
              >
                Nation of Nowhere
              </s.TextTitle> */}
              <StyledImg
                className=" img-fluid fluid"
                style={{
                  marginTop: "-100px",
                  width: "240px"
                }}
                src="/config/images/NONLOGO.png"
              ></StyledImg>

              <s.SpacerSmall />

              <StyledLogo
                style={{}}
                alt={"logo"}
                src={"/config/images/logo.png"}
              />

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                  marginTop: -10,
                }}
              >
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </s.TextTitle>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              ></s.TextDescription>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.SpacerXSmall />
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    Mint price 0.099 ETH
                  </s.TextDescription>
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT WALLET
                      </StyledButton>

                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>

                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >
                          {claimingNft ? "  BUSY" : "  MINT PASSPORT"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}

                  <br></br>
                </>
              )}
              <s.SpacerMedium />
            </s.Container>
            <s.SpacerLarge />
          </ResponsiveWrapper>
          <s.SpacerMedium />
          <s.Container
            jc={"center"}
            ai={"center"}
            style={{ width: "70%" }}
          ></s.Container>
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
