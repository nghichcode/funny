import React, {useState, useContext, useEffect} from 'react';
import './App.css';

function SimpleCard({post}) {
    const actions = {
        like: 'like', dislike: 'dislike'
    };
    const [action, setAction] = useState(0);
    const [incrs, setIncrs] = useState(post._incrs);

    const handleAction = async (type) => {
        const response = await fetch(process.env.PUBLIC_URL + '/data.json');
        const jsonData = await response.json();
        if (jsonData.data) {
            setAction(type);
            const incrs_tmp = {...incrs};
            incrs_tmp[type] += 1;
            setIncrs({...incrs_tmp})
        }
    };


    return (
        <div className="col-12 pt-4" data-id={post._id}>
            <div className="simple-card">
                <div className="simple-card-avatar">
                </div>
                <div className="simple-card-content">
                    <h3 className="simple-card-title">{post.title}</h3>
                    <p className="simple-card-text">{post.content}</p>
                    <div className="text-right">
                        <small>{typeof post._created_at == 'string' ? post._created_at.substring(0, 10) : ''}</small>
                    </div>
                    <div className="simple-card-line"/>
                    <div className="simple-card-actions">
                    <span className="simple-card-text pr-10" onClick={() => handleAction(actions.like)}>
                        <i className={'fa simple-card-icon fa-thumbs-o-up pr-2 ' + (action == actions.like ? 'active' : '')}/>
                        <span>{incrs.like}</span>
                    </span>
                        <span className="simple-card-text pr-10" onClick={() => handleAction(actions.dislike)}>
                        <i className={'fa simple-card-icon fa-thumbs-o-down pr-2 ' + (action == actions.dislike ? 'active' : '')}/>
                        <span>{incrs.dislike}</span>
                    </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [posts, setPosts] = useState([]);
    const handlePosts = (id) => {

    };
    useEffect(() => {
        const getData = async () => {
            const response = await fetch(process.env.PUBLIC_URL + '/data.json');
            const jsonData = await response.json();
            if (jsonData.data) setPosts(jsonData.data);
        };
        getData();
    });

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row">
                    {posts.map((it, id) => <SimpleCard post={it} setPost={() => handlePosts(id)} key={it._id}/>)}
                </div>
            </div>
        </div>
    );
}

export default App;
