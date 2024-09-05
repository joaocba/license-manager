import { useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import "chart.js/auto";

const Charts = ({ logs }) => {
    const getChartData = (logs) => {
        const actionTypeCounts = logs.reduce((acc, log) => {
            acc[log.actionTypeName] = (acc[log.actionTypeName] || 0) + 1;
            return acc;
        }, {});

        const chartData = {
            labels: Object.keys(actionTypeCounts),
            datasets: [
                {
                    label: "Action Type Counts",
                    data: Object.values(actionTypeCounts),
                    backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                    borderWidth: 1,
                },
            ],
        };

        return chartData;
    };

    const chartData = useMemo(() => getChartData(logs), [logs]);

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        animation: {
            duration: 1000,
            easing: "easeInOutQuad",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}`;
                    },
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: "easeInOutQuad",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div className="my-4">
            <h2 className="my-4 text-xl font-semibold text-gray-600">Statistics</h2>
            <div className="flex flex-wrap">
                <div className="w-full p-4 md:w-1/2">
                    <div className="relative h-64">
                        <Bar data={chartData} options={barOptions} />
                    </div>
                </div>
                <div className="w-full p-4 md:w-1/2">
                    <div className="relative h-64">
                        <Pie data={chartData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

Charts.propTypes = {
    logs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            actionTypeId: PropTypes.number.isRequired,
            actionTypeName: PropTypes.string.isRequired,
            actionTypeDescription: PropTypes.string.isRequired,
            idUser: PropTypes.string,
            name: PropTypes.string,
            fkClient: PropTypes.string.isRequired,
            logDatetime: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Charts;
