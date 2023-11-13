import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserPage = () => {
  return (
    <div>
      <h2 className="mb-5">User list</h2>
      <div className="mb-4">
        <div className="search-box">
          <input placeholder="Search users" type="text" className="form-control search-input"></input>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
        </div>
      </div>
      <div className="px-4 user-list-container">
        <div className="scrollbar">
          <table className="user-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>mr.r.mihai</td>
                <td>Active</td>
                <td>11 Nov 2021</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
