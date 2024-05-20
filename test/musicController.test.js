const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const { getToken, _getGenres } = require('../controllers/musicController');

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

    describe('_getGenres', () => {
        let axiosGetStub;
        let mockToken;

        beforeEach(() => {
            axiosGetStub = sinon.stub(axios, 'get');
            mockToken = 'mock_access_token';
        });

        afterEach(() => {
            axiosGetStub.restore();
        });

        it('should return genres when successful', async () => {
            const mockGenres = [
                { id: 'pop', name: 'Pop' },
                { id: 'rock', name: 'Rock' }
            ];
            axiosGetStub.resolves({ data: { categories: { items: mockGenres } } });

            const genres = await _getGenres(mockToken);

            expect(genres).to.deep.equal(mockGenres);
        });

        it('should handle error when failed to fetch genres', async () => {
            axiosGetStub.rejects(new Error('Failed to get genres'));
            
            try {
                await _getGenres(mockToken);
                // If the promise resolves, fail the test
                expect.fail('_getGenres did not throw an error');
            } catch (error) {
                expect(error.message).to.equal('Failed to get genres: Failed to get genres');
            }
        });
    });
});
