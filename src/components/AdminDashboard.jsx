import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
const currentUser = JSON.parse(localStorage.getItem("user"));

const [pendingUsers, setPendingUsers] = useState([]);
const [allUsers, setAllUsers] = useState([]);
const [allProducts, setAllProducts] = useState([]);
const [search, setSearch] = useState("");

const [loadingPending, setLoadingPending] = useState(true);
const [loadingAllUsers, setLoadingAllUsers] = useState(true);
const [loadingProducts, setLoadingProducts] = useState(true);

const fetchPendingUsers = async () => {
try {
const res = await fetch(`${API_URL}/admin/pending-users`);
const data = await res.json();
setPendingUsers(Array.isArray(data) ? data : []);
} catch (error) {
console.error("Error fetching pending users:", error);
setPendingUsers([]);
} finally {
setLoadingPending(false);
}
};

const fetchAllUsers = async () => {
try {
const res = await fetch(`${API_URL}/admin/all-users`);
const data = await res.json();
setAllUsers(Array.isArray(data) ? data : []);
} catch (error) {
console.error("Error fetching all users:", error);
setAllUsers([]);
} finally {
setLoadingAllUsers(false);
}
};

const fetchAllProducts = async () => {
try {
const res = await fetch(`${API_URL}/admin/all-products`);
const data = await res.json();
setAllProducts(Array.isArray(data) ? data : []);
} catch (error) {
console.error("Error fetching all products:", error);
setAllProducts([]);
} finally {
setLoadingProducts(false);
}
};

const approveUser = async (id) => {
try {
const res = await fetch(`${API_URL}/admin/approve-user/${id}`, {
method: "PUT",
});

const data = await res.json();

if (!res.ok) {
alert(data.error || "Failed to approve user");
return;
}

alert("User approved ✅");
fetchPendingUsers();
fetchAllUsers();
} catch (error) {
console.error("Error approving user:", error);
}
};

const deleteUser = async (id) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this user?"
);
if (!confirmDelete) return;

try {
const res = await fetch(`${API_URL}/admin/delete-user/${id}`, {
method: "DELETE",
});

const data = await res.json();

if (!res.ok) {
alert(data.error || "Failed to delete user");
return;
}

alert("User deleted ❌");
fetchPendingUsers();
fetchAllUsers();
} catch (error) {
console.error("Error deleting user:", error);
}
};

const deleteProduct = async (id) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this product?"
);
if (!confirmDelete) return;

try {
const res = await fetch(
`${API_URL}/admin/delete-product/${id}`,
{
method: "DELETE",
}
);

const data = await res.json();

if (!res.ok) {
alert(data.error || "Failed to delete product");
return;
}

alert("Product deleted ❌");
fetchAllProducts();
} catch (error) {
console.error("Error deleting product:", error);
}
};

useEffect(() => {
fetchPendingUsers();
fetchAllUsers();
fetchAllProducts();
}, []);

if (!currentUser) {
return <Navigate to="/login" />;
}

if (currentUser.role !== "admin") {
return <Navigate to="/products" />;
}

const searchValue = search.toLowerCase().trim();

const filteredPendingUsers = pendingUsers
.filter((user) =>
`${user.first_name} ${user.last_name} ${user.student_id} ${user.university} ${user.faculty}`
.toLowerCase()
.includes(searchValue)
)
.sort((a, b) => {
const aText =
`${a.first_name} ${a.last_name} ${a.student_id} ${a.university} ${a.faculty}`.toLowerCase();
const bText =
`${b.first_name} ${b.last_name} ${b.student_id} ${b.university} ${b.faculty}`.toLowerCase();

if (aText.startsWith(searchValue) && !bText.startsWith(searchValue)) return -1;
if (!aText.startsWith(searchValue) && bText.startsWith(searchValue)) return 1;
return 0;
});

const filteredAllUsers = allUsers
.filter((user) =>
`${user.first_name} ${user.last_name} ${user.student_id} ${user.university} ${user.faculty}`
.toLowerCase()
.includes(searchValue)
)
.sort((a, b) => {
const aText =
`${a.first_name} ${a.last_name} ${a.student_id} ${a.university} ${a.faculty}`.toLowerCase();
const bText =
`${b.first_name} ${b.last_name} ${b.student_id} ${b.university} ${b.faculty}`.toLowerCase();

if (aText.startsWith(searchValue) && !bText.startsWith(searchValue)) return -1;
if (!aText.startsWith(searchValue) && bText.startsWith(searchValue)) return 1;
return 0;
});

const filteredAllProducts = allProducts
.filter((product) =>
`${product.name} ${product.category} ${product.type} ${product.price}`
.toLowerCase()
.includes(searchValue)
)
.sort((a, b) => {
const aText =
`${a.name} ${a.category} ${a.type} ${a.price}`.toLowerCase();
const bText =
`${b.name} ${b.category} ${b.type} ${b.price}`.toLowerCase();

if (aText.startsWith(searchValue) && !bText.startsWith(searchValue)) return -1;
if (!aText.startsWith(searchValue) && bText.startsWith(searchValue)) return 1;
return 0;
});

return (
<div className="admin-page">
<div className="admin-header">
<h1>Admin Dashboard</h1>
<p>Manage users and products</p>
</div>

<div className="admin-search">
<input
type="text"
placeholder="Search users or products..."
value={search}
onChange={(e) => setSearch(e.target.value)}
/>
</div>

<div className="admin-section">
<h2>Pending Users</h2>

{loadingPending ? (
<div className="admin-empty">Loading...</div>
) : filteredPendingUsers.length === 0 ? (
<div className="admin-empty">No pending users 🎉</div>
) : (
<div className="admin-users-grid">
{filteredPendingUsers.map((user) => (
<div key={user.id} className="admin-user-card">
<div className="admin-user-row">
<span className="admin-label">Name:</span>
<span className="admin-value">
{user.first_name} {user.last_name}
</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Student ID:</span>
<span className="admin-value">{user.student_id}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">University:</span>
<span className="admin-value">{user.university}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Faculty:</span>
<span className="admin-value">{user.faculty}</span>
</div>

<button
className="approve-btn"
onClick={() => approveUser(user.id)}
>
Approve User
</button>

<button
className="delete-btn"
onClick={() => deleteUser(user.id)}
>
Delete User
</button>
</div>
))}
</div>
)}
</div>

<div className="admin-section">
<h2>All Users</h2>

{loadingAllUsers ? (
<div className="admin-empty">Loading...</div>
) : filteredAllUsers.length === 0 ? (
<div className="admin-empty">No users found</div>
) : (
<div className="admin-users-grid">
{filteredAllUsers.map((user) => (
<div key={user.id} className="admin-user-card">
<div className="admin-user-row">
<span className="admin-label">Name:</span>
<span className="admin-value">
{user.first_name} {user.last_name}
</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Student ID:</span>
<span className="admin-value">{user.student_id}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">University:</span>
<span className="admin-value">{user.university}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Faculty:</span>
<span className="admin-value">{user.faculty}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Status:</span>
<span className="admin-value">
{Number(user.is_approved) === 1 ? "Approved ✅" : "Pending ⏳"}
</span>
</div>

<button
className="delete-btn"
onClick={() => deleteUser(user.id)}
>
Delete User
</button>
</div>
))}
</div>
)}
</div>

<div className="admin-section">
<h2>All Products</h2>

{loadingProducts ? (
<div className="admin-empty">Loading...</div>
) : filteredAllProducts.length === 0 ? (
<div className="admin-empty">No products found</div>
) : (
<div className="admin-users-grid">
{filteredAllProducts.map((product) => (
<div key={product.id} className="admin-user-card">
<div className="admin-user-row">
<span className="admin-label">Name:</span>
<span className="admin-value">{product.name}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Price:</span>
<span className="admin-value">{product.price} DA</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Category:</span>
<span className="admin-value">{product.category}</span>
</div>

<div className="admin-user-row">
<span className="admin-label">Type:</span>
<span className="admin-value">{product.type}</span>
</div>

<button
className="delete-btn"
onClick={() => deleteProduct(product.id)}
>
Delete Product
</button>
</div>
))}
</div>
)}
</div>
</div>
);
}
export default AdminDashboard;