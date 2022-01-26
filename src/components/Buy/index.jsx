import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../../styles/flex-grid";
import { useState, useEffect } from "react";

import CONTRACT_ABI from "./../../lib/abi_eth_contract.json";

import Web3 from "web3";

const BALANCE_ABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

import Link from "next/link";

export default function Buy({
  curveData,
  web3,
  web3Obj,
  walletAddress,
  setNewDataFunction,
  setShowConnectOptions,
}) {
  const [levrBalance, setLevrBalance] = useState(0);
  const [eTHbalance, setETHbalance] = useState(0);
  const [depositEth, setDepositEth] = useState("");
  const [notEnoughBalance, setNotEnoughBalance] = useState(false);
  const [status, setStatus] = useState(false);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const getLevrBalance = async (data) => {
    console.log(27, web3, web3Obj);
    let new_contract;
    const rpcURL = process.env.ETH_RPC;
    const web3_rpc = new Web3(rpcURL);
    // try {
    console.log(42, web3_rpc);
    if (web3_rpc !== undefined) {
      new_contract = new web3_rpc.eth.Contract(
        BALANCE_ABI,
        process.env.ETH_CONTRACT_ADDRESS_TOKEN_SALE
      );
    }
    const result = await new_contract.methods.balanceOf(walletAddress).call();
    const format = web3?.utils?.fromWei(result);
    setLevrBalance(format);
    // } catch (error) {
    //   console.log("Unable to get balance.", error);
    // }
  };

  const getETHbalance = async (data) => {
    const getBalance = await web3?.eth?.getBalance(data);
    const getWeiValue = await web3?.utils?.fromWei(getBalance.toString());
    //  Get Chain Id
    console.log("ETH Balance", getWeiValue);
    setETHbalance(getWeiValue);
    return getWeiValue;
  };

  const addLevrTokenToMM = async () => {
    const tokenAddress = "0xa9cccd81e1fa331ac893dfc7ff833bbb7309c720";
    const tokenSymbol = "LEVR";
    const tokenDecimals = 18;
    // const tokenImage = "https://app.levr.ly/deth-logo-svg.svg";

    try {
      const wasAdded = await web3?.currentProvider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("User added token.");
      } else {
        console.log("User cancelled.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const depositEthToLEVR = async () => {
    console.log(`depositEthToLEVR`);
    const currentBalance = await getETHbalance(walletAddress);
    console.log("currentBalance", currentBalance);
    if (parseFloat(currentBalance) >= parseFloat(depositEth)) {
      let new_contract = await new web3.eth.Contract(
        CONTRACT_ABI,
        process.env.ETH_CONTRACT_ADDRESS
      );
      setStatus(
        `Buying ${numberWithCommas(
          curveData.tokensReceived.toFixed(0)
        )} LEVR ...`
      );
      const fundit = await new_contract.methods
        .buy(walletAddress)
        .send({
          from: walletAddress,
          value: web3.utils.toWei(depositEth.toString(), "ether"),
        })
        .then((res) => {
          console.log("Success");
          getLevrBalance(walletAddress);
          setStatus(false);
        })
        .catch((err) => {
          console.log("err", err);
          setStatus("Unable to buy, please try again.");
        });
    } else {
      console.log("setNotEnoughBalance");
      setNotEnoughBalance(true);
    }
  };

  const enterEthValue = (event) => {
    const value = event.target.value == "" ? "" : event.target.value;
    if (event.target.value != "") {
      setNewDataFunction(event.target.value);
    }
    setDepositEth(value);
  };

  useEffect(() => {
    if (walletAddress != null) {
      getLevrBalance(walletAddress);
    }
  }, [web3Obj, walletAddress]);
  return (
    <Box>
      {status != false && (
        <ConnectWalletOverlay>
          <div>
            <h3>{status}</h3>
            <br />
            <br />
            <button onClick={() => setStatus(false)}>Close</button>
          </div>
        </ConnectWalletOverlay>
      )}
      {notEnoughBalance && (
        <ConnectWalletOverlay>
          <div>
            <h3>Not enough ETH in your wallet to buy </h3>
            <div>
              <h2>
                <span className=" font-weight-bold text-green">
                  {" "}
                  {numberWithCommas(curveData.tokensReceived.toFixed(0))} LEVR
                </span>
              </h2>
              <br />
              <br />
              <button onClick={() => setNotEnoughBalance(false)}>Close</button>
            </div>
          </div>
        </ConnectWalletOverlay>
      )}
      <h2 className="text-center">Your LEVR</h2>
      <BuyRow xsNoflex>
        {/* Balance */}
        <Col className="balance" size={1}>
          <Row>
            <Col size={1}>
              <h2>
                LEVR
                <br />
                Balance
              </h2>
            </Col>
            <Col className="text-right" size={1}>
              <h2 className="text-green">
                {numberWithCommas(parseFloat(levrBalance).toFixed(0))} LEVR
              </h2>
              <i>In your wallet</i>
            </Col>
          </Row>
          <div className="text-center margin-top-2">
            <button className="action" onClick={addLevrTokenToMM}>
              List on my Metamask/Wallet
            </button>
          </div>
          {walletAddress == null && (
            <ConnectWalletOverlay className="top-0">
              <button onClick={() => setShowConnectOptions(true)}>
                Connect Wallet
              </button>
            </ConnectWalletOverlay>
          )}
        </Col>
        {/* Buy */}
        <Col className="balance buy" size={1}>
          <Inner>
            <strong className="margin-bottom-1 display-block">Buy LEVR</strong>
            <div className="flex">
              <input
                value={depositEth}
                onChange={() => enterEthValue(event)}
                type="text"
                placeholder="Enter ETH amount"
              />
              {walletAddress == null ? (
                <button
                  onClick={() => setShowConnectOptions(true)}
                  className="b-r-0-10-10-0"
                >
                  Connect Wallet
                </button>
              ) : (
                <button onClick={depositEthToLEVR} className="b-r-0-10-10-0">
                  Buy
                </button>
              )}
            </div>
            <p>
              View{" "}
              <Link href="/">
                <a>Terms & Conditions</a>
              </Link>
            </p>
            <p>
              Average cost per token is{" "}
              <span className="font-weight-bold text-red">
                {curveData.priceBefore.toFixed(8)} nETH
              </span>
            </p>
            {curveData.priceBefore.toFixed(8) !==
              curveData.priceAfter.toFixed(8) && (
              <p>
                {`You'll`} raise average cost to{" "}
                <span className=" font-weight-bold text-blue">
                  {curveData.priceAfter.toFixed(8)} nETH
                </span>{" "}
                and receive{" "}
                <span className=" font-weight-bold text-green">
                  {numberWithCommas(curveData.tokensReceived.toFixed(0))} LEVR.
                </span>
              </p>
            )}
          </Inner>
        </Col>
      </BuyRow>
    </Box>
  );
}

const ConnectWalletOverlay = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 75%;
  width: 100%;
  z-index: 2;
  background: rgba(255, 255, 255, 0.5);
  text-align: center;
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  &.top-0 {
    height: 100%;
  }
`;

const BuyRow = styled(Row)`
  h2 {
    line-height: 2.3rem;
    font-size: 2em;
  }
  .balance {
    border-radius: 10px;
    background: #f5f5f5;
    padding: 2rem;
    position: relative;
    &.buy {
      padding: 0 2rem;
      background: #fff;
      button {
        width: 150px;
        min-width: auto;
      }
      @media screen and (max-width: 48em) {
        margin-top: 2rem;
        padding: 0;
      }
    }
  }
`;

const Inner = styled.div`
  margin: auto;
  max-width: 388px;
`;

const ChartRow = styled(Row)`
  > div {
    @media screen and (max-width: 48em) {
      margin-bottom: 1rem;
    }
  }
`;

const Box = styled.div`
  width: 100%;
  max-width: 1050px;
  margin: 2rem auto 0;
  padding: 0 1rem;
  position: relative;
`;

const StyledColMargin10 = styled(Col)`
  margin: 0 1rem;
  @media screen and (max-width: 48em) {
    margin: 0;
  }
`;
