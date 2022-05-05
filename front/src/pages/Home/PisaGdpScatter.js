import { ResponsiveScatterPlot } from "@nivo/scatterplot";

const PisaGdpScatter = ({ data }) => (
  <ResponsiveScatterPlot
    data={data}
    margin={{ top: 10, right: 100, bottom: 70, left: 90 }}
    xScale={{ type: "linear", min: "auto", max: "auto" }}
    xFormat=">-.2f"
    yScale={{ type: "linear", min: "auto", max: "auto" }}
    colors={{ scheme: "category10" }}
    blendMode="multiply"
    nodeSize={10}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "GDP per Capita",
      legendPosition: "middle",
      legendOffset: 46,
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "PISA Score",
      legendPosition: "middle",
      legendOffset: -60,
    }}
    legends={[]}
  />
);
export default PisaGdpScatter;
