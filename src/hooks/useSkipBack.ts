// useSkipBack.ts
import {useEffect, useRef} from 'react';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

/**
 * useSkipBack - 拦截默认的“单步返回”（物理返回键 / 手势返回 / GO_BACK）
 * 并将其替换为向上跳过指定层数的行为（pop(count)）。
 *
 * 适用场景：
 * - 页面在 Stack Navigator 中（native-stack 或 stack），并且希望在用户使用手势/物理返回时
 *   直接跳过上一个页面，回到上上个或更上层页面。
 *
 * 参数说明：
 * @param count 要 pop 的层数（必须为 >= 1 的整数）。比如传 2 则返回“上上个页面”。
 * @param screen 可选。若传入某个路由名（类型为 keyof ParamList），只有当当前路由名等于该值时才生效。
 *
 * 类型说明：
 * - ParamList: 由你项目定义的路由参数列表类型（RootStackParamList）。
 *
 * 注意：
 * - 该 Hook 依赖于 Stack 的 pop 行为。如果你的导航不是 Stack（比如 Tab），pop 可能无效。
 * - 我们只拦截“用户触发的单步返回”（POP count=1 或 GO_BACK），对于已经由程序派发的
 *   POP(2) / 自定义动作则放行，避免死循环。
 */
export function useSkipBack<ParamList extends Record<string, object | undefined>>(count: number, screen?: keyof ParamList) {
  // navigation：用于派发 StackActions.pop 等导航动作
  // 指定为 NativeStackNavigationProp 可以获得 pop / dispatch 等方法的类型提示
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();

  // route：获取当前路由信息（包括 route.name）
  // useRoute 更语义化且在组件内部类型安全
  const route = useRoute();

  // guard：防止我们发起的 navigation.dispatch 再次被 beforeRemove 拦截造成递归
  const guard = useRef(false);

  useEffect(() => {
    // 参数校验：count 必须是整数且 >= 1；如果不合法直接不安装监听器
    if (!Number.isInteger(count) || count < 1) {
      // 开发环境下提示，避免沉默失败
      // 这里不抛异常是为了不影响运行时（防止 hook 抛错导致整个组件崩溃）
      // 你也可以选择抛错以便尽早发现问题
      // eslint-disable-next-line no-console
      console.warn('[useSkipBack] 参数 count 必须为 >= 1 的整数，跳过安装监听器。', count);
      return;
    }

    // beforeRemove 事件：在导航将要移除当前路由时触发（包括手势返回、物理返回、programmatic）
    const unsub = navigation.addListener('beforeRemove', e => {
      // e.data.action 代表将要被执行的导航动作（例如：{ type: 'POP', count: 1 }）
      const action: any = e.data?.action;

      /**
       * 我们只关心用户触发的“单步返回”：
       * - type === 'POP' 且 count === 1 （某些实现没有 count 时默认 1）
       * - 或者 type === 'GO_BACK'（history 风格或旧版本动作）
       *
       * 其他类型（例如我们程序主动 dispatch 的 POP(2)、REPLACE、RESET 等）不处理。
       */
      const isSinglePop = action?.type === 'POP' && (action?.count ?? 1) === 1;
      const isGoBack = action?.type === 'GO_BACK';

      if (!isSinglePop && !isGoBack) {
        // 不是我们要拦截的“单步返回”，直接放行（不 preventDefault）
        return;
      }

      // 如果路由栈长度不足以 pop 指定层数，则放行（避免 pop 越界）
      // navigation.getState().routes.length 给出当前栈里 routes 的数量
      const routesLen = navigation.getState()?.routes?.length ?? 1;
      if (routesLen <= count) {
        // 栈里页面不足，放行默认行为（比如退出应用或回到顶层）
        return;
      }

      // 如果传入了 screen 参数，且当前 route.name 不等于该 screen，则放行
      // 注意：route.name 的类型是 string | undefined，我们把 screen 强制为 string 比较
      if (screen && route.name !== (screen as string)) {
        return;
      }

      // re-entry guard：如果我们已经在处理中（防止重复进入），直接放行
      if (guard.current) return;

      // 到这里说明：确实是用户的“单步返回”且满足我们替换为 pop(count) 的条件
      // 阻止默认的返回动作（阻止原本一层的 pop）
      e.preventDefault();

      // 打标记，防止接下来的 navigation.dispatch 被再次拦截
      guard.current = true;

      // 使用 requestAnimationFrame 将真实的 pop 动作放到下一帧执行：
      // - 有助于让手势动画更平滑
      // - 避免在 beforeRemove 的同步调用里直接 dispatch 导致潜在问题
      requestAnimationFrame(() => {
        // 以 StackActions.pop(count) 进行跳层（向上 pop count 层）
        // 这里我们直接 dispatch 原生的 pop 动作
        navigation.dispatch(StackActions.pop(count));

        // 复位 guard，允许后续的返回操作被再次拦截（如果需要）
        guard.current = false;
      });
    });

    // 清理监听器
    return unsub;
    // 注意依赖项：navigation 与 route.name 可能在某些实现里稳定或改变，
    // 把它们列入依赖数组以保证逻辑随路由变化更新。
  }, [navigation, count, screen, route.name]);
}
