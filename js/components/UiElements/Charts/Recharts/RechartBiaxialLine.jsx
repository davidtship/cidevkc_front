import { LineChart, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useThemeContext } from '@/common/context';
import colors from '@/constants/colors';
const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];
const RechartBiaxialLine = () => {
    const { settings } = useThemeContext();
    const selectedColor = settings.color;
    const themeColor = colors[selectedColor] || selectedColor;
    return (<>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
        }}>
          <CartesianGrid strokeDasharray="3 3 3"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke={themeColor} activeDot={{ r: 8 }}/>
          <Line type="monotone" dataKey="uv" stroke="#adb5bd"/>
        </LineChart>
      </ResponsiveContainer>
    </>);
};
export default RechartBiaxialLine;
