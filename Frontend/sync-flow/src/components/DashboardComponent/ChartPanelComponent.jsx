import React from 'react'
import { Sparkles, ShieldCheck, Users2, BarChart3 } from "lucide-react";
import { BarChart, ChartPanel } from '../../pages/dashboard/DashboardSections';
import { TeamLoadCard } from './TeamLoadCard';
import { sumValues } from '../../utils/dashboardUtils';

const ChartPanelComponent = ({ prioritySeries, workloadSeries, isSoloProject }) => {
  return (
    <div>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <ChartPanel
                title="Priority mix"
                subtitle="Where the board needs attention right now."
                icon={BarChart3}
              >
                <BarChart
                  items={prioritySeries}
                  total={sumValues(prioritySeries)}
                  emptyLabel="No priority data available yet."
                />
              </ChartPanel>

              <ChartPanel
                title={isSoloProject ? "Solo focus" : "Team load"}
                subtitle={
                  isSoloProject
                    ? "A compact overview for single-owner projects."
                    : "Distribution of assigned work across contributors."
                }
                icon={isSoloProject ? ShieldCheck : Users2}
              >
                <TeamLoadCard items={workloadSeries} isSolo={isSoloProject} />
              </ChartPanel>
            </section>
    </div>
  )
}

export default ChartPanelComponent
