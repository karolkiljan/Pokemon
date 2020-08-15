import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {createUseStyles} from 'react-jss'

import MainLeft from "./components/LeftColumn";
import MainRight from "./components/RightColumn";
import DetailsComponent from "./components/DetailsComponent";


const Main = () => {
    const classes = useStyles()
    return (
        <div className={classes.App}>
            <MainLeft/>
            <MainRight />
        </div>
    )
}

function App() {
    return (
        <Router>
            <Route exact path={'/'} component={Main}/>
            <Switch>
                <Route path={'/:id'} children={<DetailsComponent />}/>
            </Switch>
        </Router>

    );
}

const useStyles = createUseStyles({
    App : {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
    },
})

export default App
