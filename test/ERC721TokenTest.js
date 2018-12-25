//const ERC721Token = artifacts.require('ERC721Token')
const ERC721Token = artifacts.require('../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721');


contract('ERC721Token', accounts => { 
    var defaultAccount = accounts[0]
    var user1 = accounts[1]
    var user2 = accounts[2]
    var operator = accounts[3]

    beforeEach(async function() { 
        this.contract = await ERC721Token.new({from: defaultAccount})
    })

    describe('can create a token', () => { 
        let tokenId = 1
        let tx

        beforeEach(async function () { 
            tx = await this.contract.mint(tokenId, {from: user1})
        })

        it('ownerOf tokenId is user1', async function () { 
            //Add your logic here
            assert.equal(await this.contract.ownerOf(tokenId), user1)
        })

        it('balanceOf user1 is incremented by 1', async function () { 
           // Add your logic here
           assert.equal(await this.contract.balanceOf(user1), 1)
        })

        it('emits the correct event during creation of a new token', async function () { 
            assert.equal(tx.logs[0].event, 'Transfer')
        })
    })

    describe('can transfer token', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () { 
            await this.contract.mint(tokenId, {from: user1})

            tx = await this.contract.transferFrom(user1, user2, tokenId, {from: user1})
        })

        it('token has new owner', async function () { 
            // Add your logic here
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('emits the correct event', async function () { 
            // Add your logic here
            assert.equal(tx.logs[0].event, 'Transfer')
        })

        it('only permissioned users can transfer tokens', async function() { 
            // Add your logic here
            assert.equal(await this.contract.isApprovedOrOwner(tokenId, {from: user1}), false)
            assert.equal(await this.contract.isApprovedOrOwner(tokenId, {from: user2}), true)
        })
    })

    describe('can grant approval to transfer', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () { 
            await this.contract.mint(tokenId, {from: user1})
            tx = await this.contract.approve(user2, tokenId, {from: user1})
        })

        it('set user2 as an approved address', async function () { 
            //Add your logic here
            assert.equal(await this.contract.getApproved(tokenId), user2)
        })

        it('user2 can now transfer', async function () { 
            // Add your logic here
            assert.equal(await this.contract.isApprovedOrOwner(tokenId, {from: user2}), true)
        })

        it('emits the correct event', async function () { 
            // Add your logic here
            assert.equal(tx.logs[0].event, 'Approval')
        })
    })

    describe('can set an operator', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () { 
            await this.contract.mint(tokenId, {from: user1})

            tx = await this.contract.setApprovalForAll(operator, true, {from: user1})
        })

        it('can set an operator', async function () { 
           // Add your logic here
           assert.equal(await this.contract.isApprovedForAll(user1, operator), true)
        })
    })
})

var expectThrow = async function(promise) { 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return
    }

    assert.fail('Expected an error but didnt see one!')
}
