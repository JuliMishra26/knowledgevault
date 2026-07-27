import type { GraphQLContext } from '@/graphql/context';

export function authenticated<TArgs = unknown, TResult = unknown>(
  resolver: (
    parent: unknown,
    args: TArgs,
    context: GraphQLContext
  ) => TResult | Promise<TResult>
) {
  return (parent: unknown, args: TArgs, context: GraphQLContext) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return resolver(parent, args, context);
  };
}
