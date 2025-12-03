import { Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import Home from "./Pages/Home"
import About from "./Pages/About"
import AllPosts from "./Pages/AllPost"
import CreatePost from "./Pages/CreatePost"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="AllPosts" element={<AllPosts />} />
        <Route path="CreatePost" element={<CreatePost />} />
      </Route>
    </Routes>
    
  )
}

export default App
