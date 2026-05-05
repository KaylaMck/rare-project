import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { AdminOnly } from "./AdminOnly"
import { TagList } from "../components/tags/TagList"
import { TagCreate } from "../components/tags/TagCreate"
import { TagEdit } from "../components/tags/TagEdit"
import { PostDetail } from "../components/posts/PostDetail"
import { ManagePostTags } from "../components/posts/ManagePostTags"
import { PostList } from "../components/posts/PostList"
import { PostsByCategory } from "../components/posts/PostsByCategory"
import { PostsByTag } from "../components/posts/PostsByTag"
import { PostCreate } from "../components/posts/PostCreate"
import { MyPostList } from "../components/posts/MyPostList"
import { PostEdit } from "../components/posts/PostEdit"
import { CategoryList } from "../components/categories/CategoryList"
import { CategoryEdit } from "../components/categories/CategoryEdit"
import { CategoryCreate } from "../components/categories/CategoryCreate"
import { CommentEdit } from "../components/comments/CommentEdit"
import { CommentCreate } from "../components/comments/CommentCreate"
import { UserProfileList } from "../components/users/UserProfileList"
import { UserProfileDetail } from "../components/users/UserProfileDetail"
import { UserPostList } from "../components/users/UserPostList"
import { UserTypeForm } from "../components/users/UserTypeForm"
import { Home } from "../components/home/Home"
import { UnapprovedPostList } from "../components/posts/UnapprovedPostList"
import { ApprovedPostList } from "../components/posts/ApprovedPostList"
import { PostSearch } from "../components/posts/PostSearch"
import { DemotionQueueList } from "../components/users/DemotionQueueList"
import { ReactionCreate } from "../components/reactions/ReactionCreate"

export const ApplicationViews = ({ token, setToken, isAdmin }) => {
  return <>
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />}  />
      <Route path="/register" element={<Register setToken={setToken} />}  />
      <Route element={<Authorized token={token} />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/search" element={<PostSearch />} />
        <Route path="/posts/new" element={<PostCreate />} />
        <Route path="/tags" element={<TagList />} />
        <Route path="/posts/:postId" element={<PostDetail isAdmin={isAdmin} />} />
        <Route path="/posts/:postId/tags" element={<ManagePostTags />} />
        <Route path="/posts/:postId/edit" element={<PostEdit />} />
        <Route path="/myposts" element={<MyPostList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/:categoryId/posts" element={<PostsByCategory />} />
        <Route path="/tags/:tagId/posts" element={<PostsByTag />} />
        <Route path="/posts/:postId/comments/new" element={<CommentCreate />} />
        <Route path="/comments/:commentId/edit" element={<CommentEdit />} />
        <Route path="/profiles/:userId" element={<UserProfileDetail />} />
        <Route path="/profiles/:userId/posts" element={<UserPostList />} />
        <Route element={<AdminOnly isAdmin={isAdmin} />}>
          <Route path="/tags/new" element={<TagCreate />} />
          <Route path="/tags/:tagId/edit" element={<TagEdit />} />
          <Route path="/categories/new" element={<CategoryCreate />} />
          <Route path="/categories/:categoryId/edit" element={<CategoryEdit />} />
          <Route path="/profiles" element={<UserProfileList />} />
          <Route path="/profiles/:userId/edit-type" element={<UserTypeForm />} />
          <Route path="/unapprovedposts" element={<UnapprovedPostList />} />
          <Route path="/approvedposts" element={<ApprovedPostList />} />
          <Route path="/demotionqueue" element={<DemotionQueueList />} />
          <Route path="/reactions/new" element={<ReactionCreate />} />
        </Route>
      </Route>
    </Routes>
  </>
}
