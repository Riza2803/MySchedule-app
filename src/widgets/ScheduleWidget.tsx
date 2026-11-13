import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { AgendaItem } from '../types';

interface ScheduleWidgetProps {
  agendas: AgendaItem[];
  todayDate: string;
}

export function ScheduleWidget({ agendas, todayDate }: ScheduleWidgetProps) {
  const todayAgendas = (agendas || []).filter(a => a.date === todayDate);
  // Jika ada agenda hari ini, tampilkan hari ini. Jika belum ada, tampilkan agenda terdekat yang ada.
  const displayAgendas = (todayAgendas.length > 0 ? todayAgendas : agendas || []).slice(0, 2);
  const totalToday = todayAgendas.length;
  const completedToday = todayAgendas.filter(a => a.isCompleted).length;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1F241E',
        borderRadius: 18,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header Widget - ketuk untuk membuka aplikasi */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
        clickAction="OPEN_APP"
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FlexWidget
            style={{
              backgroundColor: '#5A6E58',
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginRight: 6,
            }}
          >
            <TextWidget
              text="MYSCHEDULE"
              style={{
                color: '#FAF9F6',
                fontSize: 10,
                fontWeight: '700',
              }}
            />
          </FlexWidget>
          <TextWidget
            text={todayAgendas.length > 0 ? 'Hari Ini' : 'Agenda'}
            style={{
              color: '#FAF9F6',
              fontSize: 12,
              fontWeight: '600',
            }}
          />
        </FlexWidget>

        <TextWidget
          text={totalToday > 0 ? `${completedToday}/${totalToday} Selesai` : 'Buka Aplikasi'}
          style={{
            color: '#A4A7A0',
            fontSize: 11,
          }}
        />
      </FlexWidget>

      {/* Body: Daftar Agenda */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {displayAgendas.length === 0 ? (
          <FlexWidget
            style={{
              width: 'match_parent',
              backgroundColor: '#2A3029',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            clickAction="OPEN_APP"
          >
            <TextWidget
              text="Belum ada agenda"
              style={{
                color: '#FAF9F6',
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 2,
              }}
            />
            <TextWidget
              text="+ Ketuk untuk menambah agenda"
              style={{
                color: '#5A6E58',
                fontSize: 11,
                fontWeight: '700',
              }}
            />
          </FlexWidget>
        ) : (
          displayAgendas.map(item => {
            const timeLabel = item.endTime
              ? `${item.startTime} - ${item.endTime}`
              : `Mulai ${item.startTime}`;

            return (
              <FlexWidget
                key={item.id}
                style={{
                  width: 'match_parent',
                  backgroundColor: '#2A3029',
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  marginBottom: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Kolom Informasi Tugas & Jam - ketuk teks untuk buka app */}
                <FlexWidget
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginRight: 8,
                  }}
                  clickAction="OPEN_APP"
                >
                  <TextWidget
                    text={timeLabel}
                    style={{
                      color: item.isCompleted ? '#7E837A' : '#D4973B',
                      fontSize: 11,
                      fontWeight: '700',
                      marginBottom: 2,
                    }}
                  />
                  <TextWidget
                    text={item.title}
                    maxLines={1}
                    truncate="END"
                    style={{
                      color: item.isCompleted ? '#7E837A' : '#FAF9F6',
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  />
                </FlexWidget>

                {/* Tombol Interaktif untuk menandai berjalan / selesai */}
                <FlexWidget
                  style={{
                    backgroundColor: item.isCompleted ? '#363E34' : '#5A6E58',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  clickAction="TOGGLE_TASK"
                  clickActionData={{ id: item.id, isCompleted: item.isCompleted }}
                >
                  <TextWidget
                    text={item.isCompleted ? '✓ Selesai' : 'Mulai/Selesai'}
                    style={{
                      color: '#FAF9F6',
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  />
                </FlexWidget>
              </FlexWidget>
            );
          })
        )}
      </FlexWidget>

      {/* Footer hint */}
      <FlexWidget
        style={{
          width: 'match_parent',
          alignItems: 'center',
          marginTop: 2,
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text="Ketuk judul atau header untuk membuka MySchedule"
          style={{
            color: '#6E716A',
            fontSize: 9,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
