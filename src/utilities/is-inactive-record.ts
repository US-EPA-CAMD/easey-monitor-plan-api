export const isInactiveRecord = (beginDate: Date, endDate: Date) => {
    const today = new Date();
    const evaluationBeginDate = new Date('2008-01-01');
    const evaluationEndDate = new Date(today);
    evaluationEndDate.setFullYear(today.getFullYear() + 1);
    if (
        endDate === null ||
        new Date(endDate) < evaluationBeginDate ||
        new Date(beginDate) > evaluationEndDate
    ) {
        return true;
    }
    console.log("beginDate===", beginDate, "endDate===", endDate)
    return false;
};
