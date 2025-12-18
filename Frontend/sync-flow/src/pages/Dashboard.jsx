import { useAuth } from '../hooks/Auth';

const Dashboard = () => {
  const { data } = useAuth();
  return (
    <div>
      Hello i am protect {data.name} route
    </div>
  )
}

export default Dashboard
