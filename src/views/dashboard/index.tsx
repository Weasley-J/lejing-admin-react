import styles from '@/views/dashboard/index.module.less'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Descriptions, DescriptionsProps } from 'antd'
import useZustandStore from '@/store/useZustandStore.ts'
import { debugEnable, log } from '@/common/loggerProvider.ts'
import Loading from '@/views/loading'
import { Environment } from '@/types/enums.ts'
import { UcDashboard, User } from '@/types/apiTypes.ts'
import { formatMoneyCNY, formatNumberWithComma, formatUserStatus } from '@/utils'
import api from '@/api'
import root from '@/mockdata/root.json'

// Lazy loading for charts
const OrderTransactionChart = React.lazy(() => import('@/views/dashboard/children/OrderTransactionChart.tsx'))
const DriverDistributionPieChart = React.lazy<React.ComponentType<any>>(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('@/views/dashboard/children/BusinessOverviewPieChart.tsx')), 1000) // 延迟加载
  })
})
const ModelDiagnosticsRadarChart = React.lazy(() => import('@/views/dashboard/children/ModelDiagnosticsRadarChart.tsx'))

function getCardItems(userInfo?: User.Info): DescriptionsProps['items'] {
  if (Environment.isLocal()) {
    return root.user.info
  } else {
    return [
      { key: '1', label: '用户 ID', children: userInfo?.userId },
      { key: '2', label: '邮箱', children: userInfo?.userEmail },
      { key: '3', label: '状态', children: formatUserStatus(userInfo?.state) },
      { key: '4', label: '手机号', children: userInfo?.mobile },
      { key: '5', label: '职位', children: userInfo?.job },
      { key: '6', label: '部门', children: userInfo?.deptName },
    ]
  }
}

function getAvatar(avatar: string): string {
  return Environment.isNotProduction() ? root.user.avatar : avatar
}

// Dashboard component
const Dashboard: React.FC = () => {
  useRef<HTMLDivElement>(null)
  const { isDarkEnable, userInfo } = useZustandStore()
  if (debugEnable) log.info('isDarkEnable: ', isDarkEnable)

  const [report, setReport] = useState<UcDashboard.Report>()
  const username = Environment.isLocal() ? 'Weasley' : userInfo?.userName
  const items: DescriptionsProps['items'] = getCardItems(userInfo)
  const cardData = [
    { title: '货运人员', count: `${formatNumberWithComma(report?.driverCount)} 个` },
    { title: '总流水', count: `${formatMoneyCNY(report?.totalMoney)} 元` },
    { title: '总单量', count: `${formatNumberWithComma(report?.orderCount)} 单` },
    { title: '开通城市', count: `${formatNumberWithComma(report?.cityNum)} 个` },
  ]

  useEffect(() => {
    getReport()
  }, [])

  async function getReport() {
    const data = await api.getReport()
    setReport(data)
  }

  return (
    <>
      <div className={styles.dashboardWrapper}>
        <div className={styles.userInfo}>
          <img src={getAvatar(userInfo.userImg)} className={styles.avatar} alt={'avatar'} />
          <Descriptions
            title={
              <div>
                欢迎 <span style={{ fontStyle: 'italic' }}>{username}</span>，开心每一天！
              </div>
            }
            items={items}
          />
        </div>
      </div>
      <div className={styles.reportWrapper}>
        {cardData.map(({ title, count }, index) => (
          <div key={index} className={`${styles.card} ${isDarkEnable ? styles.darkCard : styles.lightCard}`}>
            <div className={styles.title}>{title}</div>
            <div className={styles.count}>{count}</div>
          </div>
        ))}
      </div>
      <div className={styles.chartContainer}>
        <Suspense fallback={<Loading />}>
          <OrderTransactionChart />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <DriverDistributionPieChart />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <ModelDiagnosticsRadarChart />
        </Suspense>
      </div>
    </>
  )
}

export default Dashboard
