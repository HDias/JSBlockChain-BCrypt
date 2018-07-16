// alterar para https://www.npmjs.com/package/bcrypt
// const SHA256 = require('crypto-js/sha256');
var bcrypt = require('bcrypt');

//https://www.youtube.com/watch?v=zVqczFZr124&t=801s

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
    }

    calculateHash() {
        const saltRounds = 10;
        const myPlaintextPassword = this.dataToCrypt();

        return bcrypt.hashSync(myPlaintextPassword, saltRounds);
    }

    dataToCrypt() {
        return this.index + this.previousHash + this.timestamp + JSON.stringify((this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2018', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();

        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(! bcrypt.compareSync(currentBlock.dataToCrypt(), currentBlock.hash)) {
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
hDiasCoin.addBlock(new Block(1, '02/01/2018', {amount: 2}));
hDiasCoin.addBlock(new Block(2, '03/01/2018', {amount: 5}));

console.log('Blockachain é válido?', hDiasCoin.isChainValid());

hDiasCoin.chain[1].data = { amount: 100}

console.log('Blockachain é válido?', hDiasCoin.isChainValid());

// console.log(JSON.stringify(hDiasCoin, null, 2));