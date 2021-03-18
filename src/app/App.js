import React, {useState, useEffect} from 'react';
import './App.css';

const PAGE_INFO = {
  startPage: 0,
  size: 10,
  btmPad: 10,
  url: process.env.PUBLIC_URL + '/data.json'
};

const appendPosts = async (page, size) => {
  console.log(page, size);
  const response = await fetch(PAGE_INFO.url);
  const jsonData = await response.json();
  if (jsonData.data) {
    return jsonData.data;
  }
  return false;
};


function SimpleCard({post}) {
  const url = process.env.PUBLIC_URL + '/data.json';
  const actions = {
    like: 'like', dislike: 'dislike'
  };
  const [action, setAction] = useState(0);
  const [incrs, setIncrs] = useState(post._incrs);

  const handleAction = async (type) => {
    const response = await fetch(url);
    const jsonData = await response.json();
    if (jsonData.data) {
      setAction(type);
      const incrs_tmp = {...incrs};
      if (incrs_tmp[type] === post._incrs[type]) incrs_tmp[type] += 1;
      setIncrs({...incrs_tmp})
    }
  };


  return (
    <div className="col-12 pt-4" data-id={post._id}>
      <div className="s-card">
        <div className="s-card-avatar">
        </div>
        <div className="s-card-content">
          <h3 className="s-card-title">{post.title}</h3>
          <p className="s-card-text">{post.content}</p>
          <div className="text-right">
            <small>{typeof post._created_at === 'string' ? post._created_at.substring(0, 10) : ''}</small>
          </div>
          <div className="s-card-line"/>
          <div className="s-card-actions">
            <span className="s-card-text btn pr-10" onClick={() => handleAction(actions.like)}>
                <i className={
                  'fa s-card-icon fa-thumbs-o-up pr-2 ' + (action === actions.like ? 'active' : '')
                }/>
                <span>{incrs.like}</span>
            </span>
            <span className="s-card-text btn pr-10" onClick={() => handleAction(actions.dislike)}>
                <i className={
                  'fa s-card-icon fa-thumbs-o-down pr-2 ' + (action === actions.dislike ? 'active' : '')
                }/>
                <span>{incrs.dislike}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const {size, startPage} = PAGE_INFO;

  const [store, setStore] = useState({
    page: startPage, loading: false, posts: []
  });

  useEffect(() => {
    function componentDidMount() {
      window.onscroll = function () {
        const {scrollTop, scrollHeight} = document.documentElement;
        if (scrollTop + window.innerHeight >= scrollHeight - PAGE_INFO.btmPad) {
          if (store.loading) return;
          // setLoading(true);
          // appendPosts(page, size).then(_posts => {
          //   setPage(page + size);
          //   setLoading(false);
          //   setPosts([...posts, ..._posts]);
          // });
        }
      };
      setStore({...store, loading: true});
      appendPosts(store.page, size).then(_posts => {
        setStore({page: store.page + size, loading: false, posts: [...store.posts, ..._posts]});
      });
    }

    componentDidMount();
  }, []);

  return (
    <div className="App">
      {console.log(new Date().getTime())}
      <div className="container-fluid">
        <div className="row">
          {store.posts.map((it, id) => <SimpleCard post={it} key={it._id + id}/>)}
        </div>
      </div>
    </div>
  );
}

export default App;
