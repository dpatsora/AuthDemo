
import React from 'react'
import './App.css';
import { Web3ProviderWrapper } from '../utils/providers';
import { MetaMaskButton } from '../components/MetaMaskButton';



function App() {
    return (
        <div className="App">
             
            <Web3ProviderWrapper>
                <MetaMaskButton />
            </Web3ProviderWrapper>
        </div>
    );
}

export default App;
