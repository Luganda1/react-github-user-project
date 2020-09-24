import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();


const GithubProvider = ({children}) => {

//Provider, consumer // context gives us options the provider and the consume but with the use 0f context hooks we dont 

    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, SetRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);
    //Request Loading 
    const [requests, setRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    //Error
    const [error, setError] = useState({show: false, msg: ''})



    const searchGithubUser = async(user) => {
        toggleError();// we want to reset our error massage every time we do the search
        setIsLoading(true);
        // console.log(user);
        const response = await axios(`${rootUrl}/users/${user}`)
        .catch((err) => console.log(err));
        // console.log(response);

        if(response) {
            setGithubUser(response.data)
            const { login, followers_url}  = response.data;
            
            /** NOTICE  that our data loads in beats and peices so to stop that we use the promise 
            //repos
            axios(`${rootUrl}/users/${login}/repos?per_page=100`)
            .then((response) => SetRepos(response.data))
            //https://api.github.com/users/john-smilga/repos?per_page=100

            // followers
            axios(`${followers_url}?per_page=100`)
            .then((response) => setFollowers(response.data))
                //https://api.github.com/users/john-smilga/followers
                */
            
            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`)
            ])
            .then((results) => {
                const [repos, followers] = results;
                const status = "fulfilled";

                if(repos.status === status) {
                    SetRepos(repos.value.data);
                }
                if(followers.status ===status) {
                    setFollowers(followers.value.data);
                }
            })
            .catch((err) => console.log(err))
        }else {
            toggleError(true, "There is no user with that username")
        }
        checkRequests();
        setIsLoading(false);
    };

     
    //check Requests // here we gonna use axios insteady of fetch and fyi it return a json hance we dont need to change our data to json 
    //we also have axios in our dependancies so we just need to import it just like above// its best for perfoming requests
    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
        .then(({data}) => {
            let {rate: {remaining} } = data;
            // remaining = 0;// to test and see the error msg
            setRequests(remaining);

            if(remaining === 0) {
                toggleError(true, "sorry, you have exeeded your hourly rate limit!")
            }
            // console.log(remaining)
        })
        .catch((err) => console.log(err))
    }

        function toggleError(show = false, msg = "") {
            setError({show, msg})
        }




    //useEffect
    useEffect(checkRequests, []);



        return <GithubContext.Provider 
        value={{githubUser,
            repos, 
            followers, 
            requests, 
            error, 
            searchGithubUser,
            isLoading
            }}>
        {children}
        </GithubContext.Provider>
        }


export{GithubContext, GithubProvider};