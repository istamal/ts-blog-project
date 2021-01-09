import React, { useState } from "react";
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import 'react-quill/dist/quill.snow.css';

function AddPostComponent() {
  const [value, setValue] = useState('');

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Add Post</Breadcrumb.Item>
      </Breadcrumb>
      <ReactQuill theme="snow" value={value} onChange={setValue}/>
    </>
  );
}

export default AddPostComponent;