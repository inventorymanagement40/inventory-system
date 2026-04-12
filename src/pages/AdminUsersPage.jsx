import { useEffect, useState } from 'react'
import { useToast } from '../context/useToast'
import { getUsers, updateUserRole } from '../services/usersService'

export default function AdminUsersPage() {
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRoleChange = async (id, role) => {
    setError('')
    try {
      await updateUserRole(id, role)
      await loadUsers()
      showToast(`User role updated to ${role}.`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>User Management</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="state-message">Loading users...</p>
      ) : (
        <div className="card table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="input"
                      value={user.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                    >
                      <option value="admin">admin</option>
                      <option value="staff">staff</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
