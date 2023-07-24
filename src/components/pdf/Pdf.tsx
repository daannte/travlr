import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { ActivityList } from "../../types";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginTop: "1cm",
  },
  activityDaysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  activityDayContainer: {
    marginTop: "2cm",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  activityDay: {
    fontSize: 18,
  },
  activityName: {
    marginTop: "0.2cm",
    fontSize: 14,
    alignSelf: "center",
  },
  activityTimeContainer: {
    flexDirection: "row",
    marginTop: "0.2cm",
    alignSelf: "center",
  },
  activityTime: {
    fontSize: 10,
  },
  activity: {
    borderTop: "1.5 solid black",
    marginTop: "0.3cm",
    width: "50%",
  },
  noInfo: {
    marginTop: "0.2cm",
    fontSize: 8,
  },
});

interface Props {
  destination: string;
  activityLists: ActivityList[];
}

// Create Document
const MyDocument = ({ destination, activityLists }: Props) => {
  function convertTo12HourFormat(time: string) {
    const [hours, minutes] = time.split(":");
    let period = "AM";

    let hours12 = parseInt(hours, 10);
    if (hours12 === 0) {
      hours12 = 12;
    } else if (hours12 === 12) {
      period = "PM";
    } else if (hours12 > 12) {
      hours12 -= 12;
      period = "PM";
    }

    return `${hours12}:${minutes} ${period}`;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>{destination} Itinerary</Text>
        </View>
        <View style={styles.activityDaysContainer}>
          {activityLists.map((activityList, index) => {
            return (
              <View key={index} style={styles.activityDayContainer}>
                <Text style={styles.activityDay} break>
                  {activityList.date}
                </Text>
                {activityList.isEmpty ? (
                  <Text style={styles.noInfo}>No Activities for today</Text>
                ) : (
                  activityList.activities.map((activity) => {
                    return (
                      <View key={index} style={styles.activity} break>
                        <View style={styles.activityTimeContainer}>
                          {!activity.startTime && !activity.endTime ? (
                            <Text style={styles.noInfo}>
                              No time for this activity
                            </Text>
                          ) : activity.startTime && !activity.endTime ? (
                            <Text style={styles.activityTime}>
                              {convertTo12HourFormat(activity.startTime)}
                            </Text>
                          ) : (
                            <Text style={styles.activityTime}>
                              {convertTo12HourFormat(activity.startTime)} -{" "}
                              {convertTo12HourFormat(activity.endTime)}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.activityName}>{activity.name}</Text>
                      </View>
                    );
                  })
                )}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
