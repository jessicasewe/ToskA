const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const getToken = require('../controllers/musicController');

const { expect } = chai;

describe('Music Controller', () => {
    describe('getToken', () => {
        let axiosPostStub;

        beforeEach(() => {
            axiosPostStub = sinon.stub(axios, 'post');
        });

        afterEach(() => {
            axiosPostStub.restore();
        });

        it('should return access token when successful', async () => {
            const mockAccessToken = 'mock_access_token';
            axiosPostStub.resolves({ data: { access_token: mockAccessToken } });

            const accessToken = await getToken();

            expect(accessToken).to.equal(mockAccessToken);
        });

        it('should handle error when failed to obtain access token', async () => {
            axiosPostStub.rejects(new Error('Failed to obtain access token'));
            
            try {
                await getToken();
                // If the promise resolves, fail the test
                expect.fail('getToken did not throw an error');
            } catch (error) {
                expect(error.message).to.equal('Failed to obtain access token');
            }
        });
    });
});
