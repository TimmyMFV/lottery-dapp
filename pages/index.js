import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import lotteryContract from '../blockchain/lottery'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'

export default function Home() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [lcContract, setLcContract] = useState()
  const [lotteryBalance, setLotteryBalance] = useState()
  const [lotteryCurRound, setLotteryCurRound] = useState()
  const [lotteryTotalPlayers, setLotteryTotalPlayers] = useState()
  const [lotteryLuckyNumber, setLotteryLuckyNumber] = useState()
  const [lotteryReward, setLotteryReward] = useState()
  const [lotteryRoundStatus, setLotteryRoundStatus] = useState()
  const [lotteryWinners, setLotteryWinners] = useState([])

  useEffect(() => {
    if (lcContract) {
      getBalance(),
      getCurRound(),
      getTotalPlayers(),
      getLuckyNumber(),
      getReward(),
      getRoundStatus(),
      getWinners()
    }
  }, [lcContract, lotteryBalance, lotteryCurRound, lotteryTotalPlayers, lotteryReward, lotteryRoundStatus, lotteryWinners])

  const getBalance = async() => {
    const balance = await lcContract.method.getBalance().call()
    setLotteryBalance(balance)
  }

  const getCurRound = async() => {
    const curRound = await lcContract.method.getCurRound().call()
    setLotteryCurRound(curRound)
  }

  const getTotalPlayers = async() => {
    const totalPlayers = await lcContract.method.getTotalPlayers().call()
    setLotteryTotalPlayers(totalPlayers)
  }

  const getLuckyNumber = async() => {
    const luckyNumber = await lcContract.method.getLuckyNumber().call()
    setLotteryLuckyNumber(luckyNumber)
  }

  const getReward = async() => {
    const reward = await lcContract.method.getWinningReward().call()
    setLotteryReward(reward)
  }

  const getRoundStatus = async() => {
    const isEnd = await lcContract.method.isGameEnded().call()
    if (isEnd == true) {
      setLotteryRoundStatus("End")
    } else {
      setLotteryRoundStatus("Start")
    }
  }

  const getWinners = async() => {
    const winners = await lcContract.method.getWinners().call()
    setLotteryWinners(winners)
  }

  const playHandler = async() => {
    const bettingNumber = document.getElementById("input_number").value
    try {
      await lcContract.method.play().send(bettingNumber, {
        from: address,
        value: 1,
        gas: 300000,
        gasPrice: null
      })
    } catch(error) {
      console.log(error.message)
    }
  }

  const connectWalletHandler = async () => {
    //check if MetaMask is installed
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          //request wallet connection
          await window.ethereum.request({method: "eth_requestAccounts"})
          //create web3 instance & set to state
          const web3 = new Web3(window.ethereum)
          //set web3 instance to React state
          setWeb3(web3)
          //get list of accounts
          const accounts = await web3.eth.getAccounts()
          //get 1st account to React state
          setAddress(accounts[0])

          //create local contract copy
          const lc = lotteryContract(web3)
          setLcContract(lc)
        } catch (error) {
          console.log(error.message)
        }
    } else {
      //MetaMask is not installed
      console.log("Please install MetaMask")
    }
  }

  return (
    <div>
      <Head>
        <title>Ether Lottery</title>
        <meta name="description" content="An Ethereum Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className='navbar mt-4 mb-4'>
          <div className='container'>
            <div className='navbar-brand'>
              <h1>Lottery dApp</h1>
            </div>
            <div className='navbar-end'>
              <button onClick={connectWalletHandler} className='button is-link'>Connect Wallet</button>
            </div>
          </div>
        </nav>
        <div className='container'>
          <section className='mt-5'>
            <div className='columns'>
              <div className='column is-two-thirds'>
                <section className='mt-5'>
                  <p>Choose your lucky number and enter the lottery by sending 1 Ether</p>
                  <input class="input is-link" type="number" placeholder="Input your lucky number (0 - 99)" id='input_number'></input>
                  <button onClick={playHandler} className='button is-link is-large is-light mt-3'>Play Now</button>
                </section>
                <section className='mt-5'>
                  <p><b>Dealer only:</b> Start round</p>
                  <button className='button is-primary is-large is-light mt-3'>Start</button>
                </section>
                <section className='mt-5'>
                  <p><b>Dealer only:</b> End round</p>
                  <button className='button is-primary is-large is-light mt-3'>End</button>
                </section>
                <section className='mt-5'>
                  <p><b>Dealer only:</b> Change master account</p>
                  <input class="input is-primary" type="text" placeholder="Input master account" id='input_address'></input>
                  <button className='button is-primary is-large is-light mt-3'>Change</button>
                </section>
              </div>
              <div className={`${styles.lotteryinfo} column is-one-third`}>
                <section className='mt-5'>
                  <div className='card'>
                    <div className='card-content'>
                      <div className='content'>
                        <h2>Game info</h2>
                        <div className='history-entry'>
                          <div>Round: {lotteryCurRound}</div>
                          <div>Total players: {lotteryTotalPlayers}</div>
                          <div>Lucky number: {lotteryLuckyNumber}</div>
                          <div>Status: {lotteryRoundStatus}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className='mt-5'>
                  <div className='card'>
                    <div className='card-content'>
                      <div className='content'>
                        <h2>Balance</h2>
                        <div className='balance-entry'>
                          <div>Total deposited: {lotteryBalance}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className='mt-5'>
                  <div className='card'>
                    <div className='card-content'>
                      <div className='content'>
                        <h2>Reward</h2>
                        <div className='reward-entry'>
                          <div>Each winner reward (Ether): {lotteryReward}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className='mt-5'>
                  <div className='card'>
                    <div className='card-content'>
                      <div className='content'>
                        <h2>Winners</h2>
                        <div className='winners-entry'>
                          {
                            lotteryWinners.map((winner) => {
                              <a href={`https://etherscan.io/address/${winner}`} target='_blank'>
                              {winner}
                              </a>
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; Tiki's test</p>
      </footer>
    </div>
  )
}
