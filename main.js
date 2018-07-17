/**
 * npm install --save crypto-js
 * npm install bcrypt --save 
 */
const SHA256 = require('crypto-js/sha256');
var bcrypt = require('bcrypt');

// https://www.youtube.com/watch?v=zVqczFZr124&t=801s
// https://www.youtube.com/watch?v=HneatE69814
// https://www.youtube.com/watch?v=fRV6cGXVQ4I

class Block {
    /**
     *
     * @param index |
     * @param timestamp | quando bloco foi criado
     * @param data | detalhes do blocos, transações e etc
     * @param previousHash |
     */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;

        this.hash = this.calculateHash();

        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.dataToCrypt()).toString();
        // const saltRounds = 10;
        // return bcrypt.hashSync(this.dataToCrypt(), saltRounds).toString();
    }

    dataToCrypt() {
        return this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Bloco minerado: ' + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // Gera o has com quatro 0 no início
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2018', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        // newBlock.hash = newBlock.calculateHash();

        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !==currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let hDiasCoin = new Blockchain();

console.log('Minerando Block 1...');
hDiasCoin.addBlock(new Block(1, '02/01/2018', {amount: 2}));

console.log('Minerando Block 2...');
hDiasCoin.addBlock(new Block(2, '03/01/2018', {amount: 5}));

// console.log('Blockachain é válido?', hDiasCoin.isChainValid());

// hDiasCoin.chain[1].data = { amount: 100 }
// hDiasCoin.chain[1].data = hDiasCoin.chain[1].calculateHash()

// console.log('Blockachain é válido?', hDiasCoin.isChainValid());

// console.log(JSON.stringify(hDiasCoin, null, 2));