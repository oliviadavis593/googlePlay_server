const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps endpoint', () => {
    it('should return an array of books', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1);
                const app = res.body[0]
                expect(app).to.include.all.keys(
                    'App', 'Type', 'Price', 'Rating', 'Reviews', 'Genres',
                    'Category', 'Installs', 'Size', 'Last Updated', 'Content Rating',
                    'Current Ver', 'Android Ver'
                )
            })
    })

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE'})
            .expect(400, 'Sort must be on of rating or app');
    })

    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                let sorted = true; 

                let i = 0; 

                while(i < res.body.length - 1) {
                    //compare book at `i` with next app at `i` + 1
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];

                    //if next app is less than the app i, 
                    if(appAtIPlus1.Rating < appAtI.Rating) {
                        //the books were not sorted correctly
                        sorted = false; 
                        break; //exit the loop
                    }
                    i ++
                }
                expect(sorted).to.be.true; 
            })
    })
})

