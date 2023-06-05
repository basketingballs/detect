import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

const Chart = () => {

  const data = [];
  for (let x = -20; x <= 20; x += 1) {
    data.push({ x, y: x ** 3 });
  }

  return (
    <LineChart width={400} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  );
};

export default Chart;
