export class AIStatService {
    revealMoves: number;
    flagMoves: number;
    timeSpent: number; // in seconds
    bombsFound: number;

    constructor(revealMoves: number, flagMoves: number, timeSpent: number, bombsFound: number) {
        this.revealMoves = revealMoves;
        this.flagMoves = flagMoves;
        this.timeSpent = timeSpent;
        this.bombsFound = bombsFound;
    }

    // Calculate the total number of moves
    getTotalMoves(): number {
        return this.revealMoves + this.flagMoves;
    }

    calculateTotalMoves(revealMoves: number, flagMoves: number): number {
        return revealMoves + flagMoves;
    }

    // Calculate the efficiency metric
    getEfficiencyMetric(): number {
        const totalMoves = this.getTotalMoves();
        return this.bombsFound / (totalMoves * this.timeSpent);
    }

    calculateEfficiencyMetric(bombsFound: number, totalMoves: number, timeSpent: number): number {
        return bombsFound / (totalMoves * timeSpent);
    }

    // Calculate the average moves per second
    getMovesPerSecond(): number {
        const totalMoves = this.getTotalMoves();
        return totalMoves / this.timeSpent;
    }

    calculateMovesPerSecond(totalMoves: number, timeSpent: number): number {
        return totalMoves / timeSpent;
    }

    // Calculate the average mines found per second
    getMinesPerSecond(): number {
        return this.bombsFound / this.timeSpent;
    }

    calculateMinesPerSecond(bombsFound: number, timeSpent: number): number {
        return bombsFound / timeSpent;
    }

    // Calculate the accuracy
    getAccuracy(): number {
        if (this.flagMoves === 0) return 0; // Avoid division by zero
        return this.bombsFound / this.flagMoves;
    }

    calculateAccuracy(bombsFound: number, flagMoves: number): number {
        if (flagMoves === 0) return 0; // Avoid division by zero
        return bombsFound / flagMoves;
    }

    getPerformanceOverview(): string {
        const efficiency = this.getEfficiencyMetric();
        const movesPerSecond = this.getMovesPerSecond();
        const minesPerSecond = this.getMinesPerSecond();
        const accuracy = this.getAccuracy();

        let overview = "<h2>Performance Overview:</h2><ul>";
        let recommendations = "<h2>Recommendations:</h2><ul>";
        let hasIssues = false;

        // Abstract performance descriptions with varied recommendations
        if (accuracy < 0.8) {
            overview += "<li>The AI could improve its accuracy in identifying mines.</li>";
            recommendations += "<li>Consider refining the flagging algorithm for better accuracy.</li>";
            recommendations += "<li>Increase training data or improve heuristic methods for more precise flagging.</li>";
            hasIssues = true;
        }

        if (movesPerSecond < 25) {
            overview += "<li>The AI operates at a relatively slow speed, suggesting room for faster decision-making.</li>";
            recommendations += "<li>Enhance the decision-making logic to reduce latency.</li>";
            recommendations += "<li>Explore optimization techniques to boost processing speed.</li>";
            hasIssues = true;
        }

        if (efficiency < 0.08) {
            overview += "<li>The overall efficiency of the AI could be enhanced for better performance.</li>";
            recommendations += "<li>Aim to balance the number of moves with the time spent more effectively.</li>";
            recommendations += "<li>Focus on algorithmic improvements to increase efficiency.</li>";
            hasIssues = true;
        }

        if (minesPerSecond < 10) {
            overview += "<li>The AI finds mines at a slower rate than desired.</li>";
            recommendations += "<li>Work on the mine-finding logic to identify mines quicker.</li>";
            recommendations += "<li>Implement more aggressive strategies for mine detection.</li>";
            hasIssues = true;
        }

        if (!hasIssues) {
            overview += "<li>The AI performs adequately across all measured metrics.<li>";
        }

        overview += "</ul>";
        recommendations += "</ul>";

        return overview + recommendations;
    }
}