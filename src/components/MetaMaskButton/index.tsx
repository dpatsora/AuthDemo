import axios from 'axios';
import * as React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { MetaMaskLogo } from './MetaMaskLogo';
import { getWalletBalance } from '../../scripts/getbalance.js';
//getContractBalanceOf
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 1337] });

export const MetaMaskButton: React.FunctionComponent = () => {
    const {
        account,
        activate,
        connector,
        error,
        library,
    } = useWeb3ReactCore<Web3Provider>();
    const [activatingConnector, setActivatingConnector] = React.useState<any>();
    const [balance, setBalance] = React.useState('');
    //const [ContractBalance, setContractBalance] = React.useState(['', '']);
    //const [contract, setContract] = React.useState("");
    const [user, setUser] = React.useState<any>();

    const handleConnectWallet = React.useCallback(() => {
        if (account) {
            window.console.log('MetaMask is successfully connected');
        } else {
            setActivatingConnector(injected);
            activate(injected);
        }
    }, [account, activate]);

    // function handleContractBalanceOf() {
    //     console.log(contract)
    //     async function ContractBalanceOf() {
    //         const updatedBalance = await getContractBalanceOf(account, contract);
    //         setContractBalance(updatedBalance);
    //     }

    //     ContractBalanceOf()

    // }

    React.useEffect(() => {
        async function fetchBalance() {
            const updatedBalance = await getWalletBalance(account);
            setBalance(updatedBalance);
            // if (contract) {
            //     const updatedContractBalance = await getContractBalanceOf(account, contract);
            //     setContractBalance(updatedContractBalance);
            // }
        }

        if (account) {
            fetchBalance();

        }
        if (activatingConnector &&
            activatingConnector === connector &&
            account
        ) {
            window.console.log('MetaMask is successfully connected');
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector, account]);

    React.useEffect(() => {
        if (!!error) {
            window.console.error(error);
        }

    }, [error]);

    var GoTrueURL = process.env.REACT_APP_GOTRUE
    if (!GoTrueURL) {
        GoTrueURL = "http://localhost:8000/auth/v1"
    }

    const sendChallengeToken = (token: string) => {
        axios.post(`${GoTrueURL}/asymmetric_login`, {
            key: account,
            challenge_token_signature: token,
        }).then((response: any) => {
            console.log('jwt', response.data?.access_token);


            axios.get(`${GoTrueURL}/user`, { headers: { "Authorization": `Bearer ${response.data?.access_token}` } })
                .then(res => {

                    console.log('user:', res.data);
                    setUser(res.data)

                })
                .catch(error => console.log(error))


        }).catch(err => console.log('err', err))


    }

    const signMessage = async (provider: any, challengeToken: string) => {
        try {
            console.log('Signer', provider.getSigner());
            const signer = provider.getSigner();
            const signature = await signer.signMessage(challengeToken);
            sendChallengeToken(signature);
            console.log('signature', signature);


        } catch (err) {
            console.log('err', err);
        }
    }

    React.useEffect(() => {
        if (account) {
            console.log('get address', account);
            setUser("")
            const tokenGoTrue = axios.post(`${GoTrueURL}/sign_challenge`, {
                key: account,
                algorithm: 'ETH'
            })
                .then((res: any) => {
                    const challengeToken = res.data?.challenge_token;
                    console.log('go true response, token', res.data.challenge_token);

                    signMessage(library!, challengeToken);
                }).catch(err => console.log('Supabase error:', err));
            console.log('tokenGoTrue', tokenGoTrue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    return (
        <div className="flex justify-around my-10">
            <div className="mx-6 sm:mx-8 w-full sm:w-2/3 xl:w-7/12 max-w-screen-md bg-white shadow-xl rounded-xl p-4 sm:p-8 lg:p-10 mb-10">
                <div className="flex justify-around my-6">
                    <MetaMaskLogo
                        className=""
                        onClick={handleConnectWallet}
                    />
                </div>

                {account ? (
                    <>
                        <div className="mb-6 border-b border-gray-300 pb-6">
                            <div className="flex justify-around">
                                <p className="text-gray-600 text-xs sm:text-base lg:text-lg">
                                    {account}
                                </p>
                            </div>
                            <h2 className="text-sm text-gray-700 font-bold mt-8">User balance:</h2>
                            <h3 className="text-xl md:text2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-blue-900">
                                {balance} UNI
                            </h3>

                        </div>
                        {user?.role ? (
                            <>
                                <h2 className="text-sm text-gray-700 font-bold mt-8">User id:</h2>
                                <h3 className="text-sm sm:text-lg md:text2xl lg:text-3xl font-bold">
                                    {user.id}
                                </h3>
                                <h2 className="text-sm text-gray-700 font-bold mt-4">Status:</h2>
                                <h3 className="text-lg md:text2xl lg:text-3xl font-bold text-green-500">
                                    {user.role}
                                </h3>
                                <h2 className="text-sm text-gray-700 font-bold mt-4">Created at:</h2>
                                <h3 className="text-sm sm:text-lg md:text2xl lg:text-3xl font-bold">
                                    {user.created_at}
                                </h3>
                                <h2 className="text-sm text-gray-700 font-bold mt-4">Last sign:</h2>
                                <h3 className="text-sm sm:text-lg md:text2xl lg:text-3xl font-bold">
                                    {user.last_sign_in_at}
                                </h3>

                            </>
                        ) : (<><h2 className="text-base text-gray-700 font-bold mt-8">Sign the token with your provider</h2></>)}

                        {/* <form onSubmit={e => {
                        e.preventDefault();
                        handleContractBalanceOf();
                        
                    }}>
                        <input
                            required
                            onChange={({ target }) => setContract(target.value)}
                        />

                        <button>
                            Get contract balance
                        </button>
                    </form> */}
                        {/* {ContractBalance[0] !== "" ? (

                            <>


                                <span><h2><br></br>Contract balance:</h2><span><h1>Available: {ContractBalance[0]}</h1><h1>Locked: {ContractBalance[1]}</h1></span></span>

                            </>
                        ) : (
                            <></>
                        )} */}

                    </>
                ) : (
                    <div className="flex justify-around"><h2>No connected accounts</h2></div>
                )}
            </div>
        </div>
    );
};


