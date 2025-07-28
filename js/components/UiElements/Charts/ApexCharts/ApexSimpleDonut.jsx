import { useThemeContext } from '@/common/context';
import colors from '@/constants/colors';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
const ApexSimpleDonut = () => {
    const { settings } = useThemeContext();
    const selectedColor = settings.color;
    const themeColor = colors[selectedColor] || selectedColor;
    const series = [44, 55, 41, 17, 15];
    const options = {
        colors: ['#00275E', themeColor, '#85D00B', '#00CCCC', '#6610F2'],
        labels: ['Sumi', 'Swapan', 'Sojib', 'Swampa', 'Sowrav'],
        chart: {
            width: 380,
            type: 'donut',
            foreColor: '#adb5bd',
            fontFamily: 'Public Sans, sans-serif',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
        legend: {
            show: true,
            position: 'bottom',
            itemMargin: {
                vertical: 15,
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: 'dark',
        },
    };
    return (<>
      <ReactApexChart options={options} series={series} type="donut" height={380}/>
    </>);
};
export default ApexSimpleDonut;
